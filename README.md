# react-native-scroll-into-view

Permit to scroll a ReactNative View into the visible portion of a `ScrollView`, similar to `DOMElement.scrollIntoView()` for web, with some extra useful features.

```
yarn add react-native-scroll-into-view
// or
npm install react-native-scroll-into-view --save
```

There is **no native code** and this library is compatible with Expo.

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 "Expo.io")](https://expo.io)

# Why ?

The main usecase that drives the creation of library is to ensure form errors become visible to the user as they appear. This is particularly useful on long scrollable forms, which sometimes can't be avoided by better UX.

![Formik example](https://media.giphy.com/media/1j8PXENzl0jEdRDWnT/giphy.gif)

People have also used it to build a "sections index":

![Sections example](https://media.giphy.com/media/PPTRZRXzHFfOWVpogv/giphy.gif)

But really you are free to build whatever you want with it

# Features:

- Declarative component
- Imperative API
- Configuration at many levels
- Different alignment modes
- Typescript definitions
- Support for `Animated.ScrollView`
- Support for composition/refs/other ScrollView wrappers (`react-native-keyboard-aware-scroll-view`, `glamorous-native`...)

Note we don't plan to support anything else than ScrollView, because to compute the positions we need the elements to be rendered. Note that virtualized lists generally offer methods to scroll to a given index.


# Basic usage

```js

// Available options
const options = {
  
  // auto: ensure element appears fully inside the view (if not already inside). It may align to top or bottom.
  // top: align element to top
  // bottom: align element to bottom
  // center: align element at the center of the view
  align: 'auto',
 
  
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
  
  // Advanced: use these options as escape hatches if the lib default functions do not satisfy your needs
  computeScrollY: (scrollViewLayout,viewLayout,scrollY,insets, align) => { },
  measureElement: (viewRef) => { },
};



// Wrap the original ScrollView into the HOC
// Also works with Animated.ScrollView
const CustomScrollView = wrapScrollView(ScrollView);

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
        
        <ScrollIntoView align="center">
          <Text>
            This will scroll into view on mount and will be centered
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
        
        <ScrollIntoView onMount={false} onUpdate={true} scrollIntoViewKey="some string">
          <Text>
            This will scroll into on update (if it becomes enabled, or key changes)
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
const CustomScrollView = wrapScrollViewConfigured({
  // These are needed if you need use a ScrollView wrapper that does not use React.forwardRef()
  refPropName: "innerRef",
  getScrollViewNode: ref => ref.getInstance();
  // fallback value for throttling, can be overriden by user with props
  scrollEventThrottle: 16,
  // ScrollIntoView default options
  options: scrollIntoViewOptions,
})(ScrollView);
```

`CustomScrollView` also accept a `innerRef` prop if you need to access the scrollview node this way.


# API:

The ES6 named exports are:

- `wrapScrollView` / `wrapScrollViewConfigured`: HOC that wraps a `ScrollView` and exposes a scrollIntoView API as React context
- `ScrollIntoView`, the component you generally use to make its children appear into the ScrollView

# Demos:

You can run the examples folder as an Expo app with `yarn start`

It is also [published on Expo](https://expo.io/@slorber/react-native-scroll-into-view)

![Basic example](https://media.giphy.com/media/5YqZVwlJeISATCyTOI/giphy.gif)

![Basic insets example](https://media.giphy.com/media/ZxbG056VseF0cuJUHW/giphy.gif)

![Scroll to next example](https://media.giphy.com/media/4KFxkZyoFfxPEOBw0S/giphy.gif)

![Sections example](https://media.giphy.com/media/PPTRZRXzHFfOWVpogv/giphy.gif)

![Formik example](https://media.giphy.com/media/1j8PXENzl0jEdRDWnT/giphy.gif)


# Recipes


## Using in forms:

The integration with form libraries like [Formik](https://github.com/jaredpalmer/formik) and Redux-form is very simple (see [Formik example](https://github.com/slorber/react-native-scroll-into-view/blob/master/examples/src/screens/FormikScreen.js))

![Formik integration](https://i.imgur.com/EuBhuKg.png)

-  By default, the first error field of the form will reveal itself
- `enabled={!!error}` means we'll only scroll into view fields that have an error
- `scrollIntoViewKey={submitCount}` means we'll scroll into view fields which still have errors on every Formik submit attempt (`submitCount` is provided by Formik)

## Using with `react-native-keyboard-aware-scroll-view`

`KeyboardAwareScrollView` does not forward refs by default so we need to obtain ref by using the `innerRef` prop:
 
```
const ScrollIntoViewScrollView = wrapScrollViewConfigured({
  refPropName: 'innerRef',
})(KeyboardAwareScrollView);
```


# TODOs:

- Hooks api
- Tests
- Support horizontal ScrollView?

# Contribute

Contributions are welcome and PRs will be merged rapidly.
 
If your changes are impactful, please open an issue first.

# License

MIT

Some code is inspired from contribution of @sebasgarcep of an initial scrollIntoView support for [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view)
