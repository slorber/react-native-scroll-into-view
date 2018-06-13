import React from 'react';
import {View} from 'react-native';
import {ScrollIntoView} from "react-native-scroll-into-view";
import {Button, Centered, ScrollIntoViewScrollView} from "components/Components";



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



export default BasicScreen;



