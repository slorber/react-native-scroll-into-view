# react-native-scroll-into-view

Permit to scroll a ReactNative View into the visible screen. 

Simple port of DOMElement.scrollIntoView() function.

For now there's only support for `ScrollView`

```
yarn add react-native-scroll-into-view
// or
npm install react-native-scroll-into-view --save
```

There is **no native code** and this library is compatible with Expo.

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 "Expo.io")](https://expo.io)


# Basic usage

```js

// Available options
const scrollIntoViewOptions = {
  
  // Animate the scrollIntoView() operation 
  animated: true,
  
  // By default, scrollIntoView() calls are throttled a bit because it does not make much sense
  // to scrollIntoView() 2 elements at the same time (and sometimes even impossible)
  immediate: false,
  
  // Permit to add top/bottom insets so that element scrolled into view 
  // is not touching directly the borders of the scrollview (like a padding)
  insets: {
    top: 0,
    bottom: 0
  },
  
  // Advanced: use these options as escape hatch if the lib default functions do not satisfy your needs
  getScrollPosition: (scrollViewLayout,viewLayout,scrollY,insets) => { },
  measureElement: (viewRef) => { },
};



// Wrap the original ScrollView into the HOC
const CustomScrollView = ScrollIntoViewWrapper(ScrollView);


class MyScreen extends React.Component {
  render() {
    return (
      <CustomScrollView 
        // Can provide default options (overrideable)
        scrollIntoViewOptions={scrollIntoViewOptions}
      >

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
        
        <ScrollIntoView scrollIntoViewOptions={options}>
          <Text>
            This will scroll into view on mount with custom option props
          </Text>
        </ScrollIntoView>

        <View>
          <ScrollIntoView enabled={false} ref={ref => this.scrollIntoViewRef = ref}>
            <Text>
              This will scroll into view when the button is pressed
            </Text>
          </ScrollIntoView>
          <Button
            title="Make above text scroll into view with custom options"
            onPress={() => this.scrollIntoViewRef.scrollIntoView(scrollIntoViewOptions)}
          />
        </View>

        <ScrollIntoViewConsumer>
          {scrollIntoViewAPI => (
            <View ref={ref => this.myView = ref}>
              <Button
                title="Make current view scroll into view"
                onPress={scrollIntoViewAPI.scrollIntoView(this.myView,scrollIntoViewOptions)}
              />
            </View>
          )}
        </ScrollIntoViewConsumer>

      </CustomScrollView>
    );
  }
}
```

You can also configure the HOC:

```js
const CustomScrollView = ScrollIntoViewWrapper({
  // These are needed if you need use a ScrollView wrapper that does not use React.forwardRef()
  refPropName: "innerRef",
  getScrollViewNode: ref => ref.getInstance();
  // fallback value for throttling, can be overriden by user with props
  scrollEventThrottle: 16,
  // ScrollIntoView default options
  options: scrollIntoViewOptions,
})(ScrollView);
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

![Basic insets example](https://media.giphy.com/media/ZxbG056VseF0cuJUHW/giphy.gif)

![Scroll to next example](https://media.giphy.com/media/4KFxkZyoFfxPEOBw0S/giphy.gif)


# Features:

- Imperative API
- Declarative component
- Configuration at many levels
- Support for wrapped ScrollView (`react-native-keyboard-aware-scroll-view`, Glamorous-native...)
- Support for `Animated.ScrollView` with native driver


# TODOs:

- Ability to scroll view into the center of the screen
- Support horizontal scrollview

# Contribute

Contributions are welcome and PRs will be merged rapidly.
 
If your changes are impactful, please open an issue first.

# License

MIT

Some code is inspired from contribution of @sebasgarcep of an initial scrollIntoView support for https://github.com/APSL/react-native-keyboard-aware-scroll-view
