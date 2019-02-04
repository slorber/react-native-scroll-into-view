import React, { ComponentType, LegacyRef } from 'react';

import {
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  normalizeOptions,
  PartialHOCConfig,
  PartialOptions,
  normalizeHOCConfig,
} from './config';
import { ProvideAPI } from './context';
import { ScrollIntoViewDependencies } from './api';

type ScrollViewProps = React.ComponentProps<typeof ScrollView>;
type ScrollViewScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

type HOCProps = ScrollViewProps & {
  scrollIntoViewOptions?: PartialOptions;
  scrollEventThrottle?: number;
  innerRef?: any; // TODO
  contentOffset?: number; // TODO don't remember what this is for :s
};

export type WrappableComponent = ComponentType<ScrollViewProps>;
export type WrappedComponent = ComponentType<HOCProps>;

export const wrapScrollViewHOC = (
  ScrollViewComp: WrappableComponent,
  config: PartialHOCConfig = {},
): WrappedComponent => {
  const {
    refPropName,
    getScrollViewNode,
    scrollEventThrottle,
    options,
  } = normalizeHOCConfig(config);

  class ScrollViewWrapper extends React.Component<HOCProps> {
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
          <ProvideAPI dependencies={this.dependencies}>{children}</ProvideAPI>
        </ScrollViewComp>
      );
    }
  }

  return React.forwardRef<ScrollViewWrapper, HOCProps>((props, ref) => (
    <ScrollViewWrapper innerRef={ref} {...props} />
  ));
};
