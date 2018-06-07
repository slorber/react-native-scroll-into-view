import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {ScrollIntoView, ScrollIntoViewWrapper} from "react-native-scroll-into-view";

const range = n => [...Array(n).keys()];

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


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <Centered style={{flex: 1, padding: 20}}>
        <Text style={{fontSize: 20}}>react-native-scroll-into-view</Text>
        <Text style={{fontSize: 14, marginTop: 50, textAlign: "center"}}>
          This is the demo app for react-native-scroll-into-view
        </Text>
        <Button
          style={{marginTop: 50}}
          onPress={() => this.props.navigation.navigate("Basic")}>
          Open basic example
        </Button>
        <Button
          style={{marginTop: 50}}
          onPress={() => this.props.navigation.navigate("ScrollToNext")}>
          Open Scroll-to-next example
        </Button>
      </Centered>
    );
  }
}


class BasicScreen extends React.Component {
  static navigationOptions = {
    title: 'Basic',
  };

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
      <ScrollIntoViewScrollView style={{flex: 1, width: "100%"}}>
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


class ScrollToNextScreen extends React.Component {
  static navigationOptions = {
    title: 'Scroll to next screen',
  };
  static itemsCount = 10;

  state = {
    currentItem: 0,
  };

  getNextItem = () => {
    return (this.state.currentItem + 1) % ScrollToNextScreen.itemsCount;
  };

  isCurrentItem = index => this.state.currentItem === index;

  scrollToNext = () => {
    this.setState({currentItem: this.getNextItem()});
  };

  render() {
    return (
      <View style={{flex: 1, width: "100%"}}>
        <View style={{padding: 20, borderBottomWidth: 1, borderBottomColor: "black"}}>
          <Button onPress={this.scrollToNext}>
            Scroll to next ({this.getNextItem()})
          </Button>
        </View>
        <ScrollIntoViewScrollView
          style={{flex: 1, width: "100%"}}
        >
          {range(ScrollToNextScreen.itemsCount).map(index => (
            <Centered
              key={`Item_${index}`}
              style={{
                marginTop: 800,
                width: "100%",
              }}
            >
              <ScrollIntoView
                enabled={this.isCurrentItem(index)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: "blue",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{color: "white"}}>{index}</Text>
              </ScrollIntoView>
            </Centered>
          ))}
        </ScrollIntoViewScrollView>
      </View>
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
    ScrollToNext: {
      screen: ScrollToNextScreen
    },
  },
  {
    //initialRouteName: "ScrollToNext",
  },
);




