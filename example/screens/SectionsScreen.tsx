import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ScrollIntoView } from 'scrollIntoView';
import { ScrollIntoViewScrollView } from '../components/Components';
import { range } from 'lodash';

const Sections = range(0, 10);

class SectionsScreen extends React.Component<{}> {
  static navigationOptions = {
    title: 'Sections',
  };

  // TODO better typing
  sectionsRefs = Sections.map(_section => React.createRef<any>());

  scrollSectionIntoView = (section: number) => {
    this.sectionsRefs[section].current!.scrollIntoView({ align: 'top' });
  };

  renderSectionButton = (section: number) => {
    return (
      <TouchableOpacity
        key={section}
        onPress={() => this.scrollSectionIntoView(section)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 50,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'darkgrey',
            borderRadius: 20,
          }}
        >
          <Text>{section}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderSection = (section: number) => (
    <ScrollIntoView
      key={section}
      ref={this.sectionsRefs[section]}
      onMount={false}
      onUpdate
      style={{
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#dddddd',
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: 'black',
        }}
      >
        Section {section}
      </Text>
      <Text style={{ fontSize: 14, marginTop: 20 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>
    </ScrollIntoView>
  );

  render() {
    return (
      <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
        <View
          style={{
            width: 60,
            height: '100%',
            backgroundColor: 'white',
            alignItems: 'center',
            paddingTop: 15,
          }}
        >
          {Sections.map(this.renderSectionButton)}
        </View>
        <ScrollIntoViewScrollView
          style={{
            flex: 1,
            height: '100%',
          }}
          contentContainerStyle={{
            width: '100%',
            padding: 10,
            backgroundColor: 'white',
          }}
        >
          {Sections.map(this.renderSection)}
        </ScrollIntoViewScrollView>
      </View>
    );
  }
}

export default SectionsScreen;
