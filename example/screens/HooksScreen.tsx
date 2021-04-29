import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useScrollIntoView } from '../../src';
import {
  Button,
  Centered,
  ScrollIntoViewScrollView,
} from '../components/Components';

function HooksScreenContent() {
  const scrollIntoView = useScrollIntoView();

  const viewRef = useRef<any>();

  useEffect(() => {
    scrollIntoView(viewRef.current);
  }, [scrollIntoView, viewRef]);

  function renderButton(disableDefaultInset?: boolean) {
    const text = disableDefaultInset
      ? 'Scroll Into View (NO insets)'
      : 'Scroll Into View';
    const insets = disableDefaultInset ? { top: 0, bottom: 0 } : undefined; // undefined means we let parent decide of insets
    return (
      <Centered style={{ height: 200 }}>
        <Button onPress={() => scrollIntoView(viewRef.current, { insets })}>
          {text}
        </Button>
      </Centered>
    );
  }

  return (
    <>
      {renderButton()}
      {renderButton()}
      {renderButton(true)}
      {renderButton()}
      {renderButton()}
      <Centered style={{ width: '100%' }}>
        <View
          ref={viewRef}
          style={{ width: 100, height: 100, backgroundColor: 'red' }}
        />
      </Centered>
      {renderButton()}
      {renderButton()}
      {renderButton(true)}
      {renderButton()}
      {renderButton()}
    </>
  );
}

const ScrollIntoViewInsets = {
  top: 80,
  bottom: 130,
};

function InsetLines() {
  return (
    <>
      {Object.entries(ScrollIntoViewInsets).map(([insetKey, insetValue]) => {
        return (
          <View
            key={insetKey}
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              height: insetValue,
              [insetKey]: 0,
              ['border' + (insetKey === 'top' ? 'Bottom' : 'Top') + 'Width']: 2,
              borderColor: 'blue',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
        );
      })}
    </>
  );
}

export default function HooksScreen() {
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <ScrollIntoViewScrollView
        style={{ flex: 1, width: '100%' }}
        scrollIntoViewOptions={{
          insets: ScrollIntoViewInsets,
        }}
      >
        <HooksScreenContent />
      </ScrollIntoViewScrollView>

      <InsetLines />
    </View>
  );
}

HooksScreen.navigationOptions = {
  title: 'Hooks',
};
