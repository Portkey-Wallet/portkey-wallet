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

  navigateForResult = <V,>(entry: PortkeyEntries, params: RouterOptions, callback: (res: EntryResult<V>) => void) => {
    portkeyModulesEntity.RouterModule.navigateToWithOptions(entry, this.getEntryName(), params, callback);
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

export interface BaseContainerProps {
  from?: string;
  targetScene?: string;
}

export interface BaseContainerState {}
