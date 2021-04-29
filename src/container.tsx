import React, { ReactNode, ReactNodeArray } from 'react';
import PropTypes from 'prop-types';
import { View, ViewProps } from 'react-native';
import { throttle } from './utils';
import { PartialOptions, OptionKeys, OptionKey } from './config';
import { ScrollIntoViewAPI } from './api';
import { APIConsumer } from './context';

const showNotInContextWarning = throttle(() => {
  console.warn(
    'ScrollIntoView API is not provided in React context. Make sure you wrapped your ScrollView component with wrapScrollView(ScrollView)',
  );
}, 5000);

type ContainerProps = {
  enabled?: boolean;
  scrollIntoViewKey?: string | number | boolean;
  animated?: boolean;
  immediate?: boolean;
  onMount?: boolean;
  onUpdate?: boolean;
  scrollIntoViewOptions?: PartialOptions;
  scrollIntoViewAPI?: ScrollIntoViewAPI;
  children?: ReactNode | ReactNodeArray;
} & PartialOptions &
  ViewProps;

export class ContainerBase extends React.Component<ContainerProps> {
  static propTypes = {
    // if enabled, will scrollIntoView on mount + on update (if it was previously disabled)
    enabled: PropTypes.bool.isRequired,
    // if enabled, will scrollIntoView on key change
    scrollIntoViewKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    // weither to use animation to scroll into view the element
    animated: PropTypes.bool.isRequired,
    // by default, calls are throttled because you can only scroll into view one element at a time
    immediate: PropTypes.bool.isRequired,
    // scroll into view on mount (if enabled)
    onMount: PropTypes.bool.isRequired,
    // scroll into view on update (if enabled)
    onUpdate: PropTypes.bool.isRequired,
  };

  container = React.createRef<View>();

  static defaultProps: Partial<ContainerProps> = {
    enabled: true,
    animated: true,
    immediate: false,
    onMount: true,
    onUpdate: true,
  };

  unmounted: boolean = false;

  ensureApiProvided = () => {
    if (this.props.scrollIntoViewAPI) {
      return true;
    } else {
      showNotInContextWarning();
      return false;
    }
  };

  componentDidMount() {
    // see https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/259#issuecomment-392863157
    setTimeout(() => {
      this.props.onMount && this.props.enabled && this.scrollIntoView();
    }, 0);
  }

  componentDidUpdate(prevProps: ContainerProps) {
    const hasBeenEnabled = this.props.enabled && !prevProps.enabled;
    if (this.props.onUpdate && hasBeenEnabled) {
      this.scrollIntoView();
      return;
    }
    // Allow to pass a "scrollIntoViewKey" so that
    const keyHasChanged =
      this.props.scrollIntoViewKey !== prevProps.scrollIntoViewKey;
    if (this.props.onUpdate && this.props.enabled && keyHasChanged) {
      this.scrollIntoView();
      return;
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getPropsOptions = () => {
    const options: PartialOptions = {
      ...this.props.scrollIntoViewOptions,
    };
    // Allow option shortcuts like animated={true}
    OptionKeys.forEach((optionKey: OptionKey) => {
      const optionValue = this.props[optionKey];
      if (typeof optionValue !== 'undefined') {
        // @ts-ignore
        options[optionKey] = optionValue;
      }
    });
    return options;
  };

  scrollIntoView = (providedOptions: PartialOptions = {}) => {
    if (this.unmounted) {
      return;
    }
    if (this.ensureApiProvided()) {
      const options = {
        ...this.getPropsOptions(),
        ...providedOptions,
      };
      this.props.scrollIntoViewAPI!.scrollIntoView(
        this.container.current!,
        options,
      );
    }
  };

  render() {
    return (
      <View
        {...this.props}
        ref={this.container}
        collapsable={false} // See https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
      >
        {this.props.children}
      </View>
    );
  }
}

export const Container = React.forwardRef<ContainerBase, ContainerProps>(
  (props, ref) => (
    <APIConsumer>
      {(scrollIntoViewAPI: ScrollIntoViewAPI) => (
        <ContainerBase
          ref={ref}
          {...props}
          scrollIntoViewAPI={scrollIntoViewAPI}
        />
      )}
    </APIConsumer>
  ),
);
