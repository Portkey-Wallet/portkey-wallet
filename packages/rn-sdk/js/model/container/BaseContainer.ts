import React from 'react';
import {
  PortkeyDeviceEventEmitter,
  EntryResult,
  RouterOptions,
  PortkeyModulesEntity,
} from '../../service/native-modules';
import { PortkeyEntries } from '../../config/entries';
import { VoidResult } from './UseBaseContainer';

export default abstract class BaseContainer<
  P extends BaseContainerProps,
  S extends BaseContainerState,
  R = { [key: string]: any },
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }

  private onShowEventListener: any = null;

  componentDidMount(): void {
    this.onShow();
    this.onShowEventListener = PortkeyDeviceEventEmitter.addListener('onShow', params => {
      const { containerId } = params || {};
      if (containerId === this.props.containerId) {
        this.onShow();
      }
    });
  }

  componentWillUnmount() {
    if (this.onShowEventListener != null) {
      this.onShowEventListener.remove();
    }
  }

  navigationTo = (entry: PortkeyEntries, targetScene?: string, closeCurrentScreen?: boolean) => {
    PortkeyModulesEntity.RouterModule.navigateTo(
      entry,
      this.getEntryName(),
      targetScene ?? 'none',
      closeCurrentScreen ?? false,
    );
  };

  navigateForResult = <V = VoidResult, T = { [x: string]: AcceptableValueType }>(
    entry: PortkeyEntries,
    options: RouterOptions<T>,
    callback: (res: EntryResult<V>) => void,
  ) => {
    const { params, closeCurrentScreen, navigationAnimation, navigationAnimationDuration, targetScene } = options;
    PortkeyModulesEntity.RouterModule.navigateToWithOptions(
      entry,
      this.getEntryName(),
      {
        params: params ?? ({} as any),
        closeCurrentScreen: closeCurrentScreen ?? false,
        navigationAnimation: navigationAnimation ?? 'slide',
        navigationAnimationDuration: navigationAnimationDuration ?? 2000,
        targetScene: targetScene ?? '',
      },
      callback,
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onShow() {}

  onFinish = (res: EntryResult<R>) => {
    PortkeyModulesEntity.RouterModule.navigateBack(res);
  };

  onError = (err: Error) => {
    PortkeyModulesEntity.NativeWrapperModule.onError(this.getEntryName(), err.message, { stack: err.stack });
  };

  onFatal = (err: Error) => {
    PortkeyModulesEntity.NativeWrapperModule.onFatalError(this.getEntryName(), err.message, { stack: err.stack });
  };

  onWarn = (msg: string) => {
    PortkeyModulesEntity.NativeWrapperModule.onWarning(this.getEntryName(), msg);
  };

  abstract getEntryName(): string;
}

export type BaseContainerProps = {
  from?: string;
  targetScene?: string;
  containerId?: string;
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
