import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import {
  ScrollIntoView,
  ScrollIntoViewWrapper,
} from 'react-native-scroll-into-view';
import {isFunction} from "lodash";


export const dismissKeyboardWhenCalled = callback => {
  if (isFunction(callback)) {
    return (...args) => {
      Keyboard.dismiss();
      return callback(args);
    };
  } else {
    return callback;
  }
};




export const Button = ({ style, onPress, children, ...props }) => (
  <TouchableOpacity
    style={{
      paddingHorizontal: 36,
      paddingVertical: 20,
      borderRadius: 3,
      backgroundColor: 'green',
      ...style,
    }}
    onPress={dismissKeyboardWhenCalled(onPress)}
    {...props}
  >
    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
      {children}
    </Text>
  </TouchableOpacity>
);

export const Centered = ({ style, ...props }) => (
  <View
    style={{ alignItems: 'center', justifyContent: 'center', ...style }}
    {...props}
  />
);

export const ScrollIntoViewScrollView = ScrollIntoViewWrapper(ScrollView);
ScrollIntoViewScrollView.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
};


