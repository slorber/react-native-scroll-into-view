import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import BasicScreen from './screens/BasicScreen';
import HooksScreen from './screens/HooksScreen';
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
  Hooks: {
    screen: HooksScreen,
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

const StackNavigation = createStackNavigator(
  Routes,
  {
    // initialRouteName: 'Hooks',
  },
);

export default createAppContainer(StackNavigation);
