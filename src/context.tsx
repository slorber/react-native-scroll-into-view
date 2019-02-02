import React, { ComponentClass, ComponentType, LegacyRef } from 'react';
import { ScrollIntoViewAPI, ScrollIntoViewDependencies } from './api';

const {
  Provider: ReactProvider,
  Consumer: ReactConsumer,
} = React.createContext<ScrollIntoViewAPI>(null as any);

// TODO better TS typings
export const injectAPI = <T extends {}>(WrappedComp: ComponentClass<T>) : ComponentType<T> => {
  return React.forwardRef((props: T, ref) => (
    <ReactConsumer>
      {(scrollIntoViewAPI: ScrollIntoViewAPI) => (
        <WrappedComp
          ref={ref}
          {...props}
          // @ts-ignore
          scrollIntoViewAPI={scrollIntoViewAPI}
        />
      )}
    </ReactConsumer>
  )) as ComponentType<T>;
};


export class ProvideAPI extends React.Component<{dependencies: ScrollIntoViewDependencies}> {

  api: ScrollIntoViewAPI;
  constructor(props: ProvideAPI['props']) {
    super(props);
    this.api = new ScrollIntoViewAPI(this.props.dependencies);
  }

  render() {
    return (
      <ReactProvider value={this.api}>{this.props.children}</ReactProvider>
    );
  }
}
