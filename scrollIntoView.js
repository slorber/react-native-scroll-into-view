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
  scrollY,
  insets,
) => {
  const scrollViewHeight = scrollViewLayout.height;
  const childHeight = viewLayout.height;
  // Measures are for window, so we make them relative to ScrollView instead
  const childTopY = viewLayout.y - scrollViewLayout.y;
  const childBottomY = childTopY + childHeight;
  // ChildView top is above ScrollView: align child top to scrollview top
  if (childTopY < (0 + insets.top) ) {
    return (scrollY + childTopY - insets.top)
  }
  // ChildView bottom is under ScrollView: align child bottom to scroll
  else if (childBottomY > scrollViewHeight - insets.bottom) {
    return (scrollY + childBottomY - scrollViewHeight + insets.bottom)
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
  immediate: false,
  insets: {
    top: 0,
    bottom: 0
  },
  getScrollPosition: defaultGetScrollPosition,
  measureElement: defaultMeasureElement,
};

const OptionKeys = Object.keys(DefaultOptions);


const normalizeOptions = (options = {},fallbackOptions = DefaultOptions) => ({
  ...fallbackOptions,
  ...options,
  insets: {
    ...fallbackOptions.insets,
    ...options.insets,
  },
});


export const scrollIntoView = async (scrollView, view, scrollY, options) => {
  const {
    animated,
    getScrollPosition,
    measureElement,
    insets,
  } = normalizeOptions(options);

  const [
    scrollViewLayout,
    viewLayout
  ] = await Promise.all([
    measureElement(scrollView),
    measureElement(view),
  ]);

  const y = getScrollPosition(scrollViewLayout, viewLayout, scrollY, insets);

  scrollView.getScrollResponder().scrollResponderScrollTo({x: 0, y, animated});
};



class ScrollIntoViewAPI {
  constructor(getScrollView, getScrollY, getDefaultOptions) {
    if (!getScrollView) {
      throw new Error("getScrollView is required");
    }
    if (!getScrollY) {
      throw new Error("getScrollY is required");
    }
    if (!getDefaultOptions) {
      throw new Error("getDefaultOptions is required");
    }
    this.getScrollView = getScrollView;
    this.getScrollY = getScrollY;
    this.getDefaultOptions = getDefaultOptions;
  }

  getNormalizedOptions = (options) => normalizeOptions(options,this.getDefaultOptions());

  scrollIntoView = (view, options) => {
    const normalizedOptions = this.getNormalizedOptions(options);
    if ( normalizedOptions.immediate ) {
      this.scrollIntoViewImmediate(view,normalizedOptions);
    }
    else {
      this.scrollIntoViewThrottled(view,normalizedOptions);
    }
  };

  // We throttle the calls, so that if 2 views where to scroll into view at almost the same time, only the first one will do
  // ie if we want to scroll into view form errors, the first error will scroll into view
  // this behavior is probably subjective and should be configurable?
  scrollIntoViewThrottled = throttle((view, options) => {
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
  // Default value for throttling, can be overriden by user with props
  scrollEventThrottle: 16,
  // ScrollIntoView options, can be offeriden by <ScrollIntoView> comp or imperative usage
  options: DefaultOptions,
};

const normalizeHOCConfig = (config = {},fallbackConfig = ScrollIntoViewWrapperHOCDefaultConfig) => ({
  ...ScrollIntoViewWrapperHOCDefaultConfig,
  ...fallbackConfig,
  ...config,
  options: normalizeOptions(config.options,fallbackConfig.options),
});


const ScrollIntoViewWrapperHOC = (ScrollViewComp,config = {}) => {

  const {
    refPropName,
    getScrollViewNode,
    scrollEventThrottle,
    options,
  } = normalizeHOCConfig(config);


  class ScrollIntoViewWrapper extends React.Component {

    constructor(props) {
      super(props);
      this.ref = React.createRef();
      this.scrollY = this.props.contentOffset ? this.props.contentOffset.y : 0;
    }

    handleRef = ref => {
      this.ref.current = ref;
      if (this.props.innerRef) {
        if ( typeof this.props.innerRef.current !== 'undefined' ) {
          this.props.innerRef.current = ref;
        }
        else {
          this.props.innerRef(ref);
        }
      }
    };

    handleScroll = e => {
      this.scrollY = e.nativeEvent.contentOffset.y;
    };

    getScrollY = () => this.scrollY;

    getScrollView = () => getScrollViewNode(this.ref.current);

    getDefaultOptions = () => normalizeOptions(this.props.scrollIntoViewOptions,options);

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
            getDefaultOptions={this.getDefaultOptions}
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
    this.api = new ScrollIntoViewAPI(props.getScrollView, props.getScrollY, props.getDefaultOptions);
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

const showNotInContextWarning = throttle(() => {
  console.warn("ScrollIntoView API is not provided in React context. Make sure you wrapped your ScrollView with ScrollIntoViewWrapper");
},5000);


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
    // scroll into view on mount (if enabled)
    onMount: PropTypes.bool.isRequired,
    // scroll into view on update (if enabled)
    onUpdate: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    enabled: true,
    animated: true,
    immediate: false,
    onMount: true,
    onUpdate: true,
  };

  constructor(props) {
    super(props);
  }

  ensureApiProvided = () => {
    if (this.props.scrollIntoViewAPI) {
      return true;
    }
    else {
      showNotInContextWarning();
      return false;
    }
  };

  componentDidMount() {
    // see https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/259#issuecomment-392863157
    setTimeout(() => {
      this.props.onMount && this.props.enabled && this.scrollIntoView();
    }, 0);
  }

  componentDidUpdate(prevProps) {
    const hasBeenEnabled = this.props.enabled && !prevProps.enabled;
    if (this.props.onUpdate && hasBeenEnabled) {
      this.scrollIntoView();
      return;
    }
    // Allow to pass a "scrollIntoViewKey" so that
    const keyHasChanged = this.props.scrollIntoViewKey !== prevProps.scrollIntoViewKey;
    if (this.props.onUpdate && this.props.enabled && keyHasChanged) {
      this.scrollIntoView();
      return;
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getPropsOptions = () => {
    const options = {
      ...this.props.scrollIntoViewOptions,
    };
    // Allow option shortcuts like animated={true}
    OptionKeys.forEach(optionKey => {
      const optionValue = this.props[optionKey];
      if ( typeof optionValue !== "undefined" ) {
        options[optionKey] = optionValue;
      }
    });
    return options
  };

  scrollIntoView = (providedOptions) => {
    if (this.unmounted) {
      return;
    }
    if ( this.ensureApiProvided() ) {
      const options = {
        ...this.getPropsOptions(),
        ...providedOptions,
      };
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

