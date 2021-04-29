import React from 'react';
import { ScrollIntoViewAPI, ScrollIntoViewDependencies } from './api';

const Context = React.createContext<ScrollIntoViewAPI | null>(null);

export default Context;

export const APIConsumer = Context.Consumer;

export class ProvideAPI extends React.Component<{
  dependencies: ScrollIntoViewDependencies;
}> {
  api = new ScrollIntoViewAPI(this.props.dependencies);
  render() {
    return (
      <Context.Provider value={this.api}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
