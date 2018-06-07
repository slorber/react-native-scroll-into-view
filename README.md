# react-native-scroll-into-view

Permit to scroll a ReactNative View into the visible screen. 

Simple port of DOMElement.scrollIntoView() function.

For now there's only support for `ScrollView

```
yarn add react-native-scroll-into-view
// or
npm install react-native-scroll-into-view --save
```

# API

```js
import React from "react";
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {ScrollIntoView, ScrollIntoViewWrapper, ScrollIntoViewConsumer} from "react-native-scroll-into-view";


// Wrap the original ScrollView into the HOC (also accept custom ScrollView implementations)
const CustomScrollView = ScrollIntoViewWrapper(ScrollView);



class MyScreen extends React.Component {
  render() {
    return (
      <CustomScrollView>

        <ScrollIntoView>
          <Text>
            This will scroll into view on mount
          </Text>
        </ScrollIntoView>
        
        <ScrollIntoView enabled={false}>
          <Text>
            This will scroll into view whenever enabled becomes true
          </Text>
        </ScrollIntoView>

        <ScrollIntoView scrollIntoViewKey="some string">
          <Text>
            This will scroll into view whenever scrollIntoViewKey changes
          </Text>
        </ScrollIntoView>

        <View>
          <ScrollIntoView enabled={false} ref={ref => this.scrollIntoViewRef = ref}>
            <Text>
              This will scroll into view when the button is pressed
            </Text>
          </ScrollIntoView>
          <Button
            title="Make above text scroll into view"
            onPress={() => this.scrollIntoViewRef.scrollIntoView()}
          />
        </View>

        <ScrollIntoViewConsumer>
          {scrollIntoViewAPI => (
            <View ref={ref => this.myView = ref}>
              <Button
                title="Make current view scroll into view"
                onPress={scrollIntoViewAPI.scrollIntoView(this.myView)}
              />
            </View>
          )}
        </ScrollIntoViewConsumer>

      </CustomScrollView>
    );
  }
}
```

# Examples:

![Basic example](https://media.giphy.com/media/5YqZVwlJeISATCyTOI/giphy.gif)

![Scroll to next example](https://media.giphy.com/media/4KFxkZyoFfxPEOBw0S/giphy.gif)

