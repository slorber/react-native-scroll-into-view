import React from 'react';
import {
  UIManager,
  findNodeHandle, LayoutRectangle,
} from 'react-native';

type FindNodeHandleArg = null | number | React.Component<any, any> | React.ComponentClass<any>

export const measureElement = async (element: FindNodeHandleArg): Promise<LayoutRectangle> => {
  const node = findNodeHandle(element)!;
  return new Promise<LayoutRectangle>(resolve => {
    UIManager.measureInWindow(node, (x, y, width, height) => {
      resolve({ x, y, width, height });
    });
  });
};


// See https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export const throttle = <T extends Function>(func: T, limit: number) : T => {
  let inThrottle = false;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as any as T;
};
