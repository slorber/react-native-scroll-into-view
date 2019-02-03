import React from 'react';
import { createStackNavigator } from 'react-navigation';
import BasicScreen from './screens/BasicScreen';
import ScrollToNextScreen from './screens/ScrollToNextScreen';
import HomeScreen from './screens/HomeScreen';
import FormikScreen from './screens/FormikScreen';

const Navigation = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Basic: {
      screen: BasicScreen,
    },
    ScrollToNext: {
      screen: ScrollToNextScreen,
    },
    Formik: {
      screen: FormikScreen,
    },
  },
  {
    // initialRouteName: 'Formik',
  },
);

export default Navigation;
