import React from 'react';
import { EntryResult, RouterOptions, portkeyModulesEntity } from '../../service/native-modules';
import { PortkeyEntries } from '../../config/entries';

export default abstract class BaseContainer<
  P extends BaseContainerProps,
  S extends BaseContainerState,
  R = { [key: string]: any },
> extends React.Component<P, S> {
  navigationTo = (entry: PortkeyEntries, targetScene?: string) => {
    portkeyModulesEntity.RouterModule.navigateTo(this.getEntryName(), entry, targetScene);
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
 */
export type AcceptablePropsType = {
  [key: string]: AcceptableValueType;
};

export type AcceptableValueType = boolean | string | number | Array<string | number> | null | undefined;

export interface BaseContainerState {}
