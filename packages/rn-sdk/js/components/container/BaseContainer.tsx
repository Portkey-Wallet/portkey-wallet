import React from 'react';
import { EntryResult, RouterOptions, portkeyModulesEntity } from '../../service/native-modules';
import { PortkeyEntries } from '../../config/entries';

export default abstract class BaseContainer<
  P extends BaseContainerProps,
  S extends BaseContainerState,
> extends React.Component<P, S> {
  navigationTo = (entry: PortkeyEntries, targetScene?: string) => {
    portkeyModulesEntity.RouterModule.navigateTo(entry, targetScene);
  };

  navigateForResult = <R,>(entry: PortkeyEntries, params: RouterOptions, callback: (res: EntryResult<R>) => void) => {
    portkeyModulesEntity.RouterModule.navigateToWithOptions(entry, this.getEntryName(), params, callback);
  };

  onFinish = <R,>(res: EntryResult<R>) => {
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
