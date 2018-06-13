import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {ScrollIntoView, ScrollIntoViewWrapper} from "react-native-scroll-into-view";


export const Button = ({style, children, ...props}) => (
  <TouchableOpacity
    style={{paddingHorizontal: 24, paddingVertical: 12, borderRadius: 3, backgroundColor: "green", ...style}}
    {...props}
  >
    <Text style={{color: "white", fontSize: 16}}>{children}</Text>
  </TouchableOpacity>
);


export const Centered = ({style, ...props}) => (
  <View
    style={{alignItems: "center", justifyContent: "center", ...style}}
    {...props}
  />
);

export const ScrollIntoViewScrollView = ScrollIntoViewWrapper(ScrollView);



