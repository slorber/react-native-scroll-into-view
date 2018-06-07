import React from "react";
import PropTypes from "prop-types";
import {View, UIManager, findNodeHandle} from "react-native";


const {
  Provider: ReactProvider,
  Consumer: ReactConsumer
} = React.createContext(null);


const defaultGetScrollPosition = (
  scrollViewLayout,
  viewLayout,
  scrollY
) => {
  const scrollViewHeight = scrollViewLayout.height;
  const childHeight = viewLayout.height;
  // Measures are for window, so we make them relative to ScrollView instead
  const childTopY = viewLayout.y - scrollViewLayout.y;
  const childBottomY = childTopY + childHeight;
  // ChildView top is above ScrollView: align child top to scrollview top
  if (childTopY < 0) {
    return (scrollY + childTopY)
  }
  // ChildView bottom is under ScrollView: align child bottom to scroll
  else if (childBottomY > scrollViewHeight) {
    return (scrollY + childBottomY - scrollViewHeight)
  }
  // In other cases, let scroll position unchanged
  else {
    return (scrollY)
  }
};

const defaultMeasureElement = async (element) => {
  //console.debug("defaultMeasureElement",element);
  const node = findNodeHandle(element);
  //console.debug("defaultMeasureElement node",node);

  return new Promise(resolve => {
    UIManager.measureInWindow(node, (x, y, width, height) => {
      const layout = {x, y, width, height};
      resolve(layout)
    })
  })
};

const DefaultOptions = {
  animated: true,
  getScrollPosition: defaultGetScrollPosition,
  measureElement: defaultMeasureElement,
};


const scrollIntoView = async (scrollView, view, scrollY, options) => {
  const {
    animated,
    getScrollPosition,
    measureElement
  } = {
    ...DefaultOptions,
    ...options
  };

  const [
    scrollViewLayout,
    viewLayout
  ] = await Promise.all([
    measureElement(scrollView),
    measureElement(view),
  ]);

  const y = getScrollPosition(scrollViewLayout, viewLayout, scrollY);

  scrollView.getScrollResponder().scrollResponderScrollTo({x: 0, y, animated});
};


export const ScrollIntoViewWrapper = ScrollViewComp => {
  class ScrollIntoViewWrapper extends React.Component {
    static defaultProps = {
      // in case you use a custom ScrollView implementation which use a ref prop like "innnerRef"...
      refPropName: "ref",
    };

    constructor(props) {
      super(props);
      this.scrollViewRef = React.createRef();
      this.scrollY = this.props.contentOffset ? this.props.contentOffset.y : 0;
    }

    handleRef = ref => {
      // Temporary, see https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/263
      this.scrollViewRef.current = ref;
    };

    handleScroll = e => {
      this.scrollY = e.nativeEvent.contentOffset.y;
      this.props.onScroll && this.props.onScroll(e);
    };

    getScrollY = () => this.scrollY;

    render() {
      const {children, ...props} = this.props;
      const scrollViewProps = {
        ...props,
        [this.props.refPropName]: this.handleRef,
        onScroll: this.handleScroll,
      };
      return (
        <ScrollViewComp
          {...scrollViewProps}
        >
          <ScrollIntoViewProvider
            scrollViewRef={this.scrollViewRef}
            getScrollY={this.getScrollY}
          >
            {children}
          </ScrollIntoViewProvider>
        </ScrollViewComp>
      );
    }
  }

  ScrollIntoViewWrapper.displayName = `ScrollIntoViewWrapper(${ScrollViewComp.displayName || ScrollViewComp.name || 'Component'})`;
  return ScrollIntoViewWrapper;
};


class ScrollIntoViewAPI {
  constructor(scrollViewRef, getScrollY) {
    if (!scrollViewRef) {
      throw new Error("scrollViewRef is required");
    }
    if (!getScrollY) {
      throw new Error("getScrollY is required");
    }
    this.scrollViewRef = scrollViewRef;
    this.getScrollY = getScrollY;
  }

  get = () => {
    if (!this.scrollViewRef.current) {
      throw new Error("scrollViewRef not available, make sure to use CustomScrollView as a parent");
    }
    return this.scrollViewRef.current
  };

  scrollIntoView = (view, options) => {
    const scrollView = this.get();
    const scrollY = this.getScrollY();
    return scrollIntoView(scrollView, view, scrollY, options);
  };
}

export class ScrollIntoViewProvider extends React.Component {
  constructor(props) {
    super(props);
    this.api = new ScrollIntoViewAPI(props.scrollViewRef, props.getScrollY);
  }

  render() {
    return (
      <ReactProvider value={this.api}>
        {this.props.children}
      </ReactProvider>
    );
  }
}

export const ScrollIntoViewConsumer = ReactConsumer;


export const injectScrollIntoViewAPI = WrappedComp => {
  return React.forwardRef((props, ref) => (
    <ReactConsumer>
      {scrollIntoViewAPI => (
        <WrappedComp
          ref={ref} {...props}
          scrollIntoViewAPI={scrollIntoViewAPI}
        />
      )}
    </ReactConsumer>
  ));
};


class ScrollIntoViewBaseContainer extends React.Component {

  static propTypes = {
    // if enabled, will scrollIntoView on mount + on update (if it was previously disabled)
    enabled: PropTypes.bool.isRequired,
    // if enabled, will scrollIntoView on key change
    scrollIntoViewKey: PropTypes.string
  };
  static defaultProps = {
    enabled: true
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // see https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/259#issuecomment-392863157
    setTimeout(() => {
      this.props.enabled && this.scrollIntoView();
    }, 0);
  }

  componentDidUpdate(prevProps) {
    const hasBeenEnabled = this.props.enabled && !prevProps.enabled;
    if (hasBeenEnabled) {
      this.scrollIntoView();
      return;
    }
    // Allow to pass a "scrollIntoViewKey" so that
    const keyHasChanged = this.props.scrollIntoViewKey !== prevProps.scrollIntoViewKey;
    if (this.props.enabled && keyHasChanged) {
      this.scrollIntoView();
      return;
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  scrollIntoView = () => {
    if (this.unmounted) {
      return;
    }
    this.props.scrollIntoViewAPI.scrollIntoView(this.container);
  };

  render() {
    return (
      <View
        {...this.props}
        ref={ref => this.container = ref}
        collapsable={false} // See https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
      >
        {this.props.children}
      </View>
    );
  }
}


export const ScrollIntoView = injectScrollIntoViewAPI(ScrollIntoViewBaseContainer);

