import React from 'react';
import {
  PortkeyDeviceEventEmitter,
  EntryResult,
  RouterOptions,
  portkeyModulesEntity,
} from '../../service/native-modules';
import { PortkeyEntries } from '../../config/entries';

export default abstract class BaseContainer<
  P extends BaseContainerProps,
  S extends BaseContainerState,
  R = { [key: string]: any },
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    this.onShowEventListener = PortkeyDeviceEventEmitter.addListener('onShow', rootTag => {
      if (rootTag === props.rootTag) {
        this.onShow();
      }
    });
  }

  private onShowEventListener: any = null;

  componentDidMount(): void {
    this.onShow();
  }

  componentWillUnmount() {
    if (this.onShowEventListener != null) {
      this.onShowEventListener.remove();
    }
  }

  navigationTo = (entry: PortkeyEntries, targetScene?: string) => {
    portkeyModulesEntity.RouterModule.navigateTo(entry, this.getEntryName(), targetScene);
  };

  navigateForResult = <V, T = { [x: string]: AcceptableValueType }>(
    entry: PortkeyEntries,
    options: RouterOptions<T>,
    callback: (res: EntryResult<V>) => void,
  ) => {
    portkeyModulesEntity.RouterModule.navigateToWithOptions(
      entry,
      this.getEntryName(),
      options.params == null ? Object.assign(options, { params: {} }) : options,
      callback,
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onShow() {}

  onFinish = (res: EntryResult<R>) => {
    portkeyModulesEntity.RouterModule.navigateBack(this.getEntryName(), res);
  };

  onError = (err: Error) => {
    portkeyModulesEntity.NativeWrapperModule.onError(this.getEntryName(), err.message, { stack: err.stack });
  };

  onFatal = (err: Error) => {
    portkeyModulesEntity.NativeWrapperModule.onFatalError(this.getEntryName(), err.message, { stack: err.stack });
  };

  onWarn = (msg: string) => {
    portkeyModulesEntity.NativeWrapperModule.onWarning(this.getEntryName(), msg);
  };

  abstract getEntryName(): string;
}

export type BaseContainerProps = {
  from?: string;
  targetScene?: string;
} & AcceptablePropsType;

/**
 * Accepting object structure will cause troubles in Android native, so we need to use this type to avoid it.
 *
 * for example:
 * ```
 * const obj1 = { a: { b: { c: 1 } } }; // this makes parse operations difficult in Android native
 * const obj2 = { a: '1', b: '2', c: 3.0 }; // this is fine
 * ```
 * reason: React Native provides ```ReadableMap``` object as params but requires ```Bundle``` object as given props, makes it difficult to parse them.
 */
export type AcceptablePropsType = {
  [key: string]: AcceptableValueType;
};

export type AcceptableValueType = boolean | string | number | Array<string | number> | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseContainerState {}
