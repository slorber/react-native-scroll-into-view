import React, { ComponentClass } from 'react';
import { ScrollIntoViewAPI, ScrollIntoViewDependencies } from './api';

const {
  Provider: ReactProvider,
  Consumer: ReactConsumer,
} = React.createContext<ScrollIntoViewAPI>(null as any);

// TODO better TS typings?
export const injectAPI = <T extends {}>(WrappedComp: ComponentClass<T>) => {
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
  ));
};


export class ProvideAPI extends React.Component<{dependencies: ScrollIntoViewDependencies}> {
  api = new ScrollIntoViewAPI(this.props.dependencies);
  render() {
    return (
      <ReactProvider value={this.api}>{this.props.children}</ReactProvider>
    );
  }
}
