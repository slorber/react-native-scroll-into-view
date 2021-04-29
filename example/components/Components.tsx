import React, { ReactNode } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  ViewProps,
  GestureResponderEvent,
} from 'react-native';
import { ScrollIntoView, wrapScrollViewConfigured } from '../../src';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isFunction } from 'lodash';

export const dismissKeyboardWhenCalled = (
  callback: TouchableOpacity['props']['onPress'],
): TouchableOpacity['props']['onPress'] => {
  if (isFunction(callback)) {
    return (event: GestureResponderEvent) => {
      Keyboard.dismiss();
      return callback(event);
    };
  } else {
    return callback;
  }
};

export const Button = ({
  style,
  onPress,
  children,
  ...props
}: ViewProps & { onPress: () => void; children?: ReactNode }) => (
  <TouchableOpacity
    style={[
      {
        paddingHorizontal: 36,
        paddingVertical: 20,
        borderRadius: 3,
        backgroundColor: 'green',
      },
      style,
    ]}
    onPress={dismissKeyboardWhenCalled(onPress)}
    {...props}
  >
    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
      {children}
    </Text>
  </TouchableOpacity>
);

export const Centered = ({
  style,
  ...props
}: ViewProps & { children?: ReactNode }) => (
  <View
    style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
    {...props}
  />
);

export const ScrollIntoViewScrollView = wrapScrollViewConfigured({
  refPropName: 'innerRef',
})(KeyboardAwareScrollView);
