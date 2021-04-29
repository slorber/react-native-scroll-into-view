import React from 'react';
import { Text, View } from 'react-native';
import { ScrollIntoView } from '../../src';
import {
  Button,
  Centered,
  ScrollIntoViewScrollView,
} from '../components/Components';
import { range } from 'lodash';

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

  isCurrentItem = (index: number) => this.state.currentItem === index;

  scrollToNext = () => {
    this.setState({ currentItem: this.getNextItem() });
  };

  render() {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'black',
          }}
        >
          <Button onPress={this.scrollToNext}>
            Scroll to next ({this.getNextItem()})
          </Button>
        </View>
        <ScrollIntoViewScrollView style={{ flex: 1, width: '100%' }}>
          {range(ScrollToNextScreen.itemsCount).map(index => (
            <Centered
              key={`Item_${index}`}
              style={{
                marginTop: 800,
                width: '100%',
              }}
            >
              <ScrollIntoView
                enabled={this.isCurrentItem(index)}
                align="center"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: 'blue',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white' }}>{index}</Text>
              </ScrollIntoView>
            </Centered>
          ))}
        </ScrollIntoViewScrollView>
      </View>
    );
  }
}

export default ScrollToNextScreen;
