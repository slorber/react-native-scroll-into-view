import React from "react";
import PropTypes from "prop-types";
import {Animated,View, UIManager, findNodeHandle} from "react-native";


const {
  Provider: ReactProvider,
  Consumer: ReactConsumer
} = React.createContext(null);



// See https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit)
    }
  }
};


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
  const node = findNodeHandle(element);
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


export const scrollIntoView = async (scrollView, view, scrollY, options) => {
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



class ScrollIntoViewAPI {
  constructor(getScrollView, getScrollY) {
    if (!getScrollView) {
      throw new Error("getScrollView is required");
    }
    if (!getScrollY) {
      throw new Error("getScrollY is required");
    }
    this.getScrollView = getScrollView;
    this.getScrollY = getScrollY;
  }

  scrollIntoViewImmediate = (view, options) => {
    const scrollView = this.getScrollView();
    const scrollY = this.getScrollY();
    return scrollIntoView(scrollView, view, scrollY, options);
  };

  // We throttle the calls, so that if 2 views where to scroll into view at almost the same time, only the first one will do
  // ie if we want to scroll into view form errors, the first error will scroll into view
  // this behavior is probably subjective and should be configurable?
  scrollIntoView = throttle((view, options) => {
    return scrollIntoView(this.getScrollView(), view, this.getScrollY(), options);
  }, 16);

  scrollIntoViewImmediate = (view, options) => {
    return scrollIntoView(this.getScrollView(), view, this.getScrollY(), options);
  };

}





const ScrollIntoViewWrapperHOCDefaultConfig = {

  // The ref propName to pass to the wrapped component
  // If you use something like glamorous-native, you can use "innerRef" for example
  refPropName: "ref",

  // The method to extract the raw scrollview node from the ref we got, if it's not directly the scrollview itself
  getScrollViewNode: ref => {
    // getNode() permit to support Animated.ScrollView,
    // see https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview/48786374
    if ( ref.getNode ) {
      return ref.getNode();
    }
    else {
      return ref;
    }
  },

  // Default value for throttling, can be overriden by user
  scrollEventThrottle: 16,

};

const ScrollIntoViewWrapperHOC = (ScrollViewComp,config = {}) => {

  const {
    refPropName,
    getScrollViewNode,
    scrollEventThrottle,
  } = {
    ...ScrollIntoViewWrapperHOCDefaultConfig,
    ...config,
  };

  class ScrollIntoViewWrapper extends React.Component {

    constructor(props) {
      super(props);
      this.ref = React.createRef();
      this.scrollY = this.props.contentOffset ? this.props.contentOffset.y : 0;
    }

    handleRef = ref => {
      // Temporary, see https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/263
      this.ref.current = ref;
    };

    handleScroll = e => {
      this.scrollY = e.nativeEvent.contentOffset.y;
    };

    getScrollY = () => this.scrollY;

    getScrollView = () => getScrollViewNode(this.ref.current);

    render() {
      const {children, ...props} = this.props;

      const scrollViewProps = {
        ...props,
        [refPropName]: this.handleRef,
        scrollEventThrottle: this.props.scrollEventThrottle || scrollEventThrottle,
        // See https://github.com/facebook/react-native/issues/19623
        onScroll: Animated.forkEvent(this.props.onScroll,this.handleScroll),
      };

      return (
        <ScrollViewComp
          {...scrollViewProps}
        >
          <ScrollIntoViewProvider
            getScrollView={this.getScrollView}
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


export const ScrollIntoViewWrapper = configOrComp => {
  if ( typeof configOrComp === "object" ) {
    return Comp => ScrollIntoViewWrapperHOC(Comp,configOrComp);
  }
  else {
    return ScrollIntoViewWrapperHOC(configOrComp);
  }
};


export class ScrollIntoViewProvider extends React.Component {
  constructor(props) {
    super(props);
    this.api = new ScrollIntoViewAPI(props.getScrollView, props.getScrollY);
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
    scrollIntoViewKey: PropTypes.string,
    // weither to use animation to scroll into view the element
    animated: PropTypes.bool.isRequired,
    // by default, calls are throttled because you can only scroll into view one element at a time
    immediate: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    enabled: true,
    animated: true,
    immediate: false,
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
    const options = {animated: this.props.animated};
    if ( this.props.immediate ) {
      this.props.scrollIntoViewAPI.scrollIntoViewImmediate(this.container,options);
    }
    else {
      this.props.scrollIntoViewAPI.scrollIntoView(this.container,options);
    }
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

