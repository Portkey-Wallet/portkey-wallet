import { PortkeyEntries } from 'config/entries';
import { useCallback, useEffect, useRef } from 'react';
import { EmitterSubscription } from 'react-native';
import { EntryResult, PortkeyDeviceEventEmitter, RouterOptions, portkeyModulesEntity } from 'service/native-modules';
import { AcceptableValueType } from './BaseContainer';

const useBaseContainer = (props: BaseContainerHookedProps): BaseContainerHooks => {
  const onShowListener = useRef<EmitterSubscription | null>(null);
  const { rootTag, entryName, onShow } = props;

  useEffect(() => {
    if (rootTag) {
      onShowListener.current?.remove();
      onShowListener.current = PortkeyDeviceEventEmitter.addListener('onShow', tag => {
        console.warn(`rootTag is : ${rootTag}`);
        if (rootTag === tag) {
          onShow?.();
        }
      });
    }
    return () => {
      onShowListener.current?.remove();
    };
  }, [onShow, rootTag]);

  const getEntryName = useCallback(() => entryName, [entryName]);

  const navigationTo = (entry: PortkeyEntries, targetScene?: string) => {
    portkeyModulesEntity.RouterModule.navigateTo(entry, getEntryName(), targetScene);
  };

  const navigateForResult = <V, T = { [x: string]: AcceptableValueType }>(
    entry: PortkeyEntries,
    options: RouterOptions<T>,
    callback: (res: EntryResult<V>) => void,
  ) => {
    portkeyModulesEntity.RouterModule.navigateToWithOptions(
      entry,
      getEntryName(),
      options.params == null ? Object.assign(options, { params: {} }) : options,
      callback,
    );
  };

  const onFinish = <R,>(res: EntryResult<R>) => {
    portkeyModulesEntity.RouterModule.navigateBack(getEntryName(), res);
  };

  const onError = (err: Error) => {
    portkeyModulesEntity.NativeWrapperModule.onError(getEntryName(), err.message, { stack: err.stack });
  };

  const onFatal = (err: Error) => {
    portkeyModulesEntity.NativeWrapperModule.onFatalError(getEntryName(), err.message, { stack: err.stack });
  };

  const onWarn = (msg: string) => {
    portkeyModulesEntity.NativeWrapperModule.onWarning(getEntryName(), msg);
  };

  return {
    getEntryName,
    navigationTo,
    navigateForResult,
    onFinish,
    onError,
    onFatal,
    onWarn,
  };
};

export interface BaseContainerHooks {
  getEntryName: () => string;
  navigationTo: (entry: PortkeyEntries, targetScene?: string) => void;
  navigateForResult: <V, T = { [x: string]: AcceptableValueType }>(
    entry: PortkeyEntries,
    options: RouterOptions<T>,
    callback: (res: EntryResult<V>) => void,
  ) => void;
  onFinish: <R>(res: EntryResult<R>) => void;
  onError: (err: Error) => void;
  onFatal: (err: Error) => void;
  onWarn: (msg: string) => void;
}

export interface BaseContainerHookedProps {
  rootTag?: any;
  entryName: string;
  onShow?: () => void;
}

export default useBaseContainer;
