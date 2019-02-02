import { PartialHOCConfig } from './config';
import { WrappableComponent, wrapScrollViewHOC } from './hoc';


export { ScrollIntoView } from './container'

export const wrapScrollView = (comp: WrappableComponent) => wrapScrollViewHOC(comp);

export const wrapScrollViewConfigured = (config?: PartialHOCConfig) => (comp: WrappableComponent) => wrapScrollViewHOC(comp, config);

