import React from 'react';
import {createStackNavigator} from 'react-navigation';
import BasicScreen from "screens/Basic";
import ScrollToNextScreen from "screens/ScrollToNext";
import HomeScreen from "screens/Home";




export default createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Basic: {
      screen: BasicScreen
    },
    ScrollToNext: {
      screen: ScrollToNextScreen
    },
  },
  {
    initialRouteName: "Basic",
  },
);




