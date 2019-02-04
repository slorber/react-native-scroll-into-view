import React from 'react';
import { createStackNavigator } from 'react-navigation';
import BasicScreen from './screens/BasicScreen';
import ScrollToNextScreen from './screens/ScrollToNextScreen';
import HomeScreen from './screens/HomeScreen';
import FormikScreen from './screens/FormikScreen';
import SectionsScreen from './screens/SectionsScreen';

const Routes = {
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
  Sections: {
    screen: SectionsScreen,
  },
};

export const HomeScreenNames = Object.keys(Routes).filter(
  name => name !== 'Home',
);

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
    Sections: {
      screen: SectionsScreen,
    },
  },
  {
    // initialRouteName: 'Sections',
  },
);

export default Navigation;
