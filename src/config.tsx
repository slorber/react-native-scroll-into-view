import React from 'react';
import { ScrollView } from 'react-native';
import { measureElement } from './utils';
import { computeScrollY } from './computeScrollY';

export type Insets = {
  top: number;
  bottom: number;
};

export type Align = 'auto' | 'top' | 'bottom' | 'center';

export type FullOptions = {
  align: Align;
  animated: boolean;
  immediate: boolean;
  insets: Insets;
  computeScrollY: typeof computeScrollY;
  measureElement: typeof measureElement;
};

export type PartialOptions = Partial<FullOptions>;

export const DefaultOptions: FullOptions = {
  align: 'auto',
  animated: true,
  immediate: false,
  insets: {
    top: 0,
    bottom: 0,
  },
  computeScrollY: computeScrollY,
  measureElement: measureElement,
};

export type OptionKey = keyof FullOptions;
export const OptionKeys: OptionKey[] = Object.keys(
  DefaultOptions,
) as OptionKey[];

export const normalizeOptions = (
  options: PartialOptions = {},
  fallbackOptions: FullOptions = DefaultOptions,
) => ({
  ...fallbackOptions,
  ...options,
  insets: {
    ...fallbackOptions.insets,
    ...options.insets,
  },
});

export type FullHOCConfig = {
  refPropName: string;
  getScrollViewNode: (scrollView: ScrollView) => ScrollView;
  scrollEventThrottle: 16;
  options: PartialOptions;
};
export type PartialHOCConfig = Partial<FullHOCConfig>;

export const DefaultHOCConfig: FullHOCConfig = {
  // The ref propName to pass to the wrapped component
  // If you use something like glamorous-native, you can use "innerRef" for example
  refPropName: 'ref',
  // The method to extract the raw scrollview node from the ref we got, if it's not directly the scrollview itself
  getScrollViewNode: (scrollView: ScrollView) => {
    // getNode() permit to support Animated.ScrollView,
    // see https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview/48786374
    // @ts-ignore
    if (scrollView.getNode) {
      // @ts-ignore
      return scrollView.getNode();
    } else {
      return scrollView;
    }
  },
  // Default value for throttling, can be overriden by user with props
  scrollEventThrottle: 16,
  // ScrollIntoView options, can be offeriden by <ScrollIntoView> comp or imperative usage
  options: DefaultOptions,
};

export const normalizeHOCConfig = (config: PartialHOCConfig = {}) => ({
  ...DefaultHOCConfig,
  ...config,
  options: normalizeOptions(config.options, DefaultOptions),
});
