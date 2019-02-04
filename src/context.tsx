import React from 'react';
import { ScrollIntoViewAPI, ScrollIntoViewDependencies } from './api';

const {
  Provider,
  Consumer,
} = React.createContext<ScrollIntoViewAPI>(null as any);


export const APIConsumer = Consumer;


export class ProvideAPI extends React.Component<{dependencies: ScrollIntoViewDependencies}> {
  api = new ScrollIntoViewAPI(this.props.dependencies);
  render() {
    return (
      <Provider value={this.api}>{this.props.children}</Provider>
    );
  }
}
