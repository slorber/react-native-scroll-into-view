import React from 'react';
import { Text } from 'react-native';
import { Button, Centered } from 'components/Components';


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <Centered style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 20 }}>react-native-scroll-into-view</Text>
        <Text style={{ fontSize: 14, marginTop: 50, textAlign: 'center' }}>
          This is the demo app for react-native-scroll-into-view
        </Text>
        <Button
          style={{ marginTop: 50 }}
          onPress={() => this.props.navigation.navigate('Basic')}>
          Basic
        </Button>
        <Button
          style={{ marginTop: 50 }}
          onPress={() => this.props.navigation.navigate('ScrollToNext')}>
          Scroll-to-next
        </Button>
        <Button
          style={{ marginTop: 50 }}
          onPress={() => this.props.navigation.navigate('Formik')}>
          Formik
        </Button>
      </Centered>
    );
  }
}


export default HomeScreen;




