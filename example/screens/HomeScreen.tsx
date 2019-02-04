import React from 'react';
import { Text } from 'react-native';
import { Button, Centered } from '../components/Components';
import { HomeScreenNames } from '../Navigation';


class HomeScreen extends React.Component<{navigation: {navigate: any}}> {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <Centered style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 20 }}>react-native-scroll-into-view</Text>
        <Text style={{ fontSize: 14, marginTop: 20, textAlign: 'center' }}>
          This is the demo app for react-native-scroll-into-view
        </Text>
        {HomeScreenNames.map(screenName => (
          <Button
            key={screenName}
            style={{ marginTop: 20 }}
            onPress={() => this.props.navigation.navigate(screenName)}>
            {screenName}
          </Button>
        ))}
      </Centered>
    );
  }
}


export default HomeScreen;




