import React from 'react';
import {
  LayoutRectangle,
} from 'react-native';
import { Insets } from './config';

export const computeScrollY = (
  scrollViewLayout: LayoutRectangle,
  viewLayout: LayoutRectangle,
  scrollY: number,
  insets: Insets,
) => {
  const scrollViewHeight = scrollViewLayout.height;
  const childHeight = viewLayout.height;
  // Measures are for window, so we make them relative to ScrollView instead
  const childTopY = viewLayout.y - scrollViewLayout.y;
  const childBottomY = childTopY + childHeight;
  // ChildView top is above ScrollView: align child top to scrollview top
  if (childTopY < 0 + insets.top) {
    return scrollY + childTopY - insets.top;
  }
  // ChildView bottom is under ScrollView: align child bottom to scroll
  else if (childBottomY > scrollViewHeight - insets.bottom) {
    return scrollY + childBottomY - scrollViewHeight + insets.bottom;
  }
  // In other cases, let scroll position unchanged
  else {
    return scrollY;
  }
};
