import { PartialHOCConfig } from './config';
import { WrappableComponent, wrapScrollViewHOC } from './hoc';
import { Container } from './container';

export * from "./hooks";

export const ScrollIntoView = Container;

export const wrapScrollView = (comp: WrappableComponent) =>
  wrapScrollViewHOC(comp);

export const wrapScrollViewConfigured = (config?: PartialHOCConfig) => (
  comp: WrappableComponent,
) => wrapScrollViewHOC(comp, config);
