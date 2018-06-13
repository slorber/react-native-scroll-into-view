# react-native-scroll-into-view

Permit to scroll a ReactNative View into the visible screen. 

Simple port of DOMElement.scrollIntoView() function.

For now there's only support for `ScrollView`

```
yarn add react-native-scroll-into-view
// or
npm install react-native-scroll-into-view --save
```

There is **no native code**. This library is compatible with Expo.

# Basic usage

```js
import React from "react";
import {Text, View, Button, ScrollView} from 'react-native';
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
        
        <ScrollIntoView animated={false}>
          <Text>
            This will scroll into view on mount without any animation
          </Text>
        </ScrollIntoView>
        
        <ScrollIntoView immediate={true}>
          <Text>
            This will not throttle scrollIntoView calls, as by default it does not make much sense to scroll into view multiple elements at the same time...
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



# API:

The ES6 named exports are:

- `ScrollIntoViewWrapper`: HOC that wraps a `ScrollView` and exposes a scrollIntoView API as React context
- `ScrollIntoView` is a container that reads the context and offer a basic declarative scrollIntoView API
- `ScrollIntoViewConsumer` and `injectScrollIntoViewAPI`: permit to get imperative access to the parent `ScrollView` scrollIntoView API (can be useful if the default `ScrollIntoView` container API does not fit your needs)
- `scrollIntoView`: imperative method to call yourself


# Demos:

You can run the examples folder as an Expo app with `yarn start`

It is also [published on Expo](https://expo.io/@slorber/react-native-scroll-into-view)


![Basic example](https://media.giphy.com/media/5YqZVwlJeISATCyTOI/giphy.gif)

![Scroll to next example](https://media.giphy.com/media/4KFxkZyoFfxPEOBw0S/giphy.gif)

# Features:

- Imperative API
- Declarative component
- Configurable HOC for advanced use-cases
- Throttle scrollIntoView calls by default
- Support for wrapped ScrollView (`react-native-keyboard-aware-scroll-view`, Glamorous-native...)
- Support for `Animated.ScrollView` with native driver

# TODOs:

- Ability to provide custom screen offsets
- Ability to scroll view into the center of the screen
- Support horizontal scrollview


# License

MIT

Some code is inspired from contribution of @sebasgarcep of an initial scrollIntoView support for https://github.com/APSL/react-native-keyboard-aware-scroll-view
