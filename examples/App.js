import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {ScrollIntoView, ScrollIntoViewWrapper} from "react-native-scroll-into-view";


const Button = ({style, children, ...props}) => (
  <TouchableOpacity
    style={{paddingHorizontal: 24, paddingVertical: 12, borderRadius: 3, backgroundColor: "green", ...style}}
    {...props}
  >
    <Text style={{color: "white", fontSize: 16}}>{children}</Text>
  </TouchableOpacity>
);


const Centered = ({style, ...props}) => (
  <View
    style={{alignItems: "center", justifyContent: "center", ...style}}
    {...props}
  />
);

const ScrollIntoViewScrollView = ScrollIntoViewWrapper(ScrollView);


class ScrollIntoViewBasicTester extends React.Component {

  renderButton = () => {
    return (
      <Centered style={{height: 200}}>
        <Button
          text="Scroll Into View"
          onPress={() => this.scrollIntoViewRef.scrollIntoView()}
        >
          Scroll the square Into View
        </Button>
      </Centered>
    );
  };

  render() {
    return (
      <ScrollIntoViewScrollView style={{flex: 1,width: "100%"}}>
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
        <ScrollIntoView ref={ref => this.scrollIntoViewRef = ref}>
          <Centered style={{width: "100%"}}>
          <View
            style={{width: 100, height: 100, backgroundColor: "red"}}
          />
          </Centered>
        </ScrollIntoView>
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
      </ScrollIntoViewScrollView>
    );
  }
}


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <Centered style={{flex: 1, padding: 20}}>
        <Text style={{fontSize: 20}}>react-native-scroll-into-view</Text>
        <Text style={{fontSize: 14, marginTop: 50, textAlign: "center"}}>This is the demo app for
          react-native-scroll-into-view</Text>
        <Button
          style={{marginTop: 50}}
          onPress={() => this.props.navigation.navigate("Basic")}>
          See Basic example
        </Button>
      </Centered>
    );
  }
}


class BasicScreen extends React.Component {
  static navigationOptions = {
    title: 'Basic',
  };

  render() {
    return (
      <Centered style={{flex: 1, width: "100%"}}>
        <ScrollIntoViewBasicTester/>
      </Centered>
    );
  }
}

export default createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Basic: {
      screen: BasicScreen
    },
  },
  {
    initialRouteName: "Home",
  },
);
