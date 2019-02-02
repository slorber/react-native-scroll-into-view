import React, { ComponentClass, ComponentType, LegacyRef } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { throttle } from './utils';
import { FullOptions, normalizeOptions, PartialHOCConfig, PartialOptions, normalizeHOCConfig, OptionKeys,
  OptionKey } from './config';

type ScrollViewProps = React.ComponentProps<typeof ScrollView>
type ScrollViewScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

const {
  Provider: ReactProvider,
  Consumer: ReactConsumer,
} = React.createContext<ScrollIntoViewAPI>(null as any);


export const backup = async (scrollView: ScrollView, view: View, scrollY: number, options: PartialOptions) => {
  const {
    animated,
    getScrollPosition,
    measureElement,
    insets,
  } = normalizeOptions(options);

  const [scrollViewLayout, viewLayout] = await Promise.all([
    measureElement(scrollView),
    measureElement(view),
  ]);

  const y = getScrollPosition(scrollViewLayout, viewLayout, scrollY, insets);

  scrollView
    .getScrollResponder()
    // @ts-ignore
    .scrollResponderScrollTo({ x: 0, y, animated });
};

type GetScrollView = () => ScrollView
type GetScrollY = () => number
type GetDefaultOptions = () => FullOptions

type ScrollIntoViewDependencies = {
  getScrollView: GetScrollView
  getScrollY: GetScrollY
  getDefaultOptions: GetDefaultOptions
}

class ScrollIntoViewAPI {

  dependencies: ScrollIntoViewDependencies;

  constructor(dependencies: ScrollIntoViewDependencies) {
    if (!dependencies.getScrollView) {
      throw new Error('getScrollView is required');
    }
    if (!dependencies.getScrollY) {
      throw new Error('getScrollY is required');
    }
    if (!dependencies.getDefaultOptions) {
      throw new Error('getDefaultOptions is required');
    }
    this.dependencies = dependencies;
  }

  getNormalizedOptions = (options: PartialOptions) =>
    normalizeOptions(options, this.dependencies.getDefaultOptions());

  scrollIntoView = (view: View, options: PartialOptions) => {
    const normalizedOptions = this.getNormalizedOptions(options);
    if (normalizedOptions.immediate) {
      return this.scrollIntoViewImmediate(view, normalizedOptions);
    } else {
      return this.scrollIntoViewThrottled(view, normalizedOptions);
    }
  };

  // We throttle the calls, so that if 2 views where to scroll into view at almost the same time, only the first one will do
  // ie if we want to scroll into view form errors, the first error will scroll into view
  // this behavior is probably subjective and should be configurable?
  scrollIntoViewThrottled = throttle((view: View, options: PartialOptions) => {
    return backup(
      this.dependencies.getScrollView(),
      view,
      this.dependencies.getScrollY(),
      options,
    );
  }, 16);
  scrollIntoViewImmediate = (view: View, options: PartialOptions) => {
    return backup(
      this.dependencies.getScrollView(),
      view,
      this.dependencies.getScrollY(),
      options,
    );
  };
}

type HOCProps = ScrollViewProps & {
  scrollIntoViewOptions?: PartialOptions
  scrollEventThrottle?: number
  innerRef?: any // TODO
  contentOffset?: number // TODO don't remember what this is for :s
}

type WrappableComponent = ComponentType<ScrollViewProps>
type WrappedComponent = ComponentType<HOCProps>

const ScrollIntoViewWrapperHOC = (ScrollViewComp: WrappableComponent, config: PartialHOCConfig = {}): WrappedComponent => {
  const {
    refPropName,
    getScrollViewNode,
    scrollEventThrottle,
    options,
  } = normalizeHOCConfig(config);


  class ScrollIntoViewWrapperComp extends React.Component<HOCProps> {

    static displayName = `ScrollIntoViewWrapper(${ScrollViewComp.displayName ||
    ScrollViewComp.name ||
    'Component'})`;

    ref: React.RefObject<ScrollView>;
    scrollY: number;
    dependencies: ScrollIntoViewDependencies;

    constructor(props: HOCProps) {
      super(props);
      this.ref = React.createRef();
      this.scrollY = this.props.contentOffset ? this.props.contentOffset.y : 0;
      this.dependencies = {
        getScrollView: this.getScrollView,
        getScrollY: this.getScrollY,
        getDefaultOptions: this.getDefaultOptions,
      };
    }

    handleRef = (ref: LegacyRef<ScrollView>) => {
      // @ts-ignore
      this.ref.current = ref;
      if (this.props.innerRef) {
        if (typeof this.props.innerRef.current !== 'undefined') {
          this.props.innerRef.current = ref;
        } else {
          this.props.innerRef(ref);
        }
      }
    };

    handleScroll = (event: ScrollViewScrollEvent) => {
      this.scrollY = event.nativeEvent.contentOffset.y;
    };

    getScrollY = () => this.scrollY;

    getScrollView = () => getScrollViewNode(this.ref.current!);

    getDefaultOptions = () =>
      normalizeOptions(this.props.scrollIntoViewOptions, options);

    render() {
      const { children, ...props } = this.props;

      const scrollViewProps = {
        ...props,
        [refPropName]: this.handleRef,
        scrollEventThrottle:
          this.props.scrollEventThrottle || scrollEventThrottle,
        // See https://github.com/facebook/react-native/issues/19623
        // @ts-ignore // TODO not yet in typedefs
        onScroll: Animated.forkEvent(this.props.onScroll, this.handleScroll),
      };

      return (
        <ScrollViewComp {...scrollViewProps}>
          <ScrollIntoViewProvider
            dependencies={this.dependencies}
          >
            {children}
          </ScrollIntoViewProvider>
        </ScrollViewComp>
      );
    }
  }

  return ScrollIntoViewWrapperComp;
};


export const wrapScrollView = (config?: PartialHOCConfig) => (comp: WrappableComponent) => ScrollIntoViewWrapperHOC(comp, config);


export class ScrollIntoViewProvider extends React.Component<{dependencies: ScrollIntoViewDependencies}> {

  api: ScrollIntoViewAPI;
  constructor(props: ScrollIntoViewProvider['props']) {
    super(props);
    this.api = new ScrollIntoViewAPI(this.props.dependencies);
  }

  render() {
    return (
      <ReactProvider value={this.api}>{this.props.children}</ReactProvider>
    );
  }
}

export const ScrollIntoViewConsumer = ReactConsumer;

// TODO better TS typings
export const injectScrollIntoViewAPI = <T extends {}>(WrappedComp: ComponentClass<T>) : ComponentType<T> => {
  return React.forwardRef((props: T, ref) => (
    <ReactConsumer>
      {(scrollIntoViewAPI: ScrollIntoViewAPI) => (
        <WrappedComp
          ref={ref}
          {...props}
          // @ts-ignore
          scrollIntoViewAPI={scrollIntoViewAPI}
        />
      )}
    </ReactConsumer>
  )) as ComponentType<T>;
};

const showNotInContextWarning = throttle(() => {
  console.warn(
    'ScrollIntoView API is not provided in React context. Make sure you wrapped your ScrollView with ScrollIntoViewWrapper',
  );
}, 5000);


type ScrollIntoViewContainerProps = {
  enabled: boolean
  scrollIntoViewKey: string | number | boolean
  animated: boolean
  immediate: boolean
  onMount: boolean
  onUpdate: boolean
  scrollIntoViewOptions: PartialOptions
  scrollIntoViewAPI: ScrollIntoViewAPI
} & PartialOptions

class ScrollIntoViewContainer extends React.Component<ScrollIntoViewContainerProps> {

  static propTypes = {
    // if enabled, will scrollIntoView on mount + on update (if it was previously disabled)
    enabled: PropTypes.bool.isRequired,
    // if enabled, will scrollIntoView on key change
    scrollIntoViewKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    // weither to use animation to scroll into view the element
    animated: PropTypes.bool.isRequired,
    // by default, calls are throttled because you can only scroll into view one element at a time
    immediate: PropTypes.bool.isRequired,
    // scroll into view on mount (if enabled)
    onMount: PropTypes.bool.isRequired,
    // scroll into view on update (if enabled)
    onUpdate: PropTypes.bool.isRequired,
  };

  container = React.createRef<View>();

  static defaultProps: Partial<ScrollIntoViewContainerProps> = {
    enabled: true,
    animated: true,
    immediate: false,
    onMount: true,
    onUpdate: true,
  };

  unmounted: boolean = false;

  ensureApiProvided = () => {
    if (this.props.scrollIntoViewAPI) {
      return true;
    } else {
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

  componentDidUpdate(prevProps: ScrollIntoViewContainerProps) {
    const hasBeenEnabled = this.props.enabled && !prevProps.enabled;
    if (this.props.onUpdate && hasBeenEnabled) {
      this.scrollIntoView();
      return;
    }
    // Allow to pass a "scrollIntoViewKey" so that
    const keyHasChanged =
      this.props.scrollIntoViewKey !== prevProps.scrollIntoViewKey;
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
    OptionKeys.forEach((optionKey: OptionKey) => {
      const optionValue = this.props[optionKey];
      if (typeof optionValue !== 'undefined') {
        options[optionKey] = optionValue;
      }
    });
    return options;
  };

  scrollIntoView = (providedOptions: PartialOptions = {}) => {
    if (this.unmounted) {
      return;
    }
    if (this.ensureApiProvided()) {
      const options = {
        ...this.getPropsOptions(),
        ...providedOptions,
      };
      this.props.scrollIntoViewAPI.scrollIntoView(this.container.current!, options);
    }
  };

  render() {
    return (
      <View
        {...this.props}
        ref={this.container}
        collapsable={false} // See https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
      >
        {this.props.children}
      </View>
    );
  }
}

export const ScrollIntoView = injectScrollIntoViewAPI(
  ScrollIntoViewContainer as ComponentClass<Partial<ScrollIntoViewContainerProps>>,
);
