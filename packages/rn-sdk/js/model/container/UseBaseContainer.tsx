import { PortkeyEntries } from 'config/entries';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { EmitterSubscription } from 'react-native';
import { EntryResult, PortkeyDeviceEventEmitter, RouterOptions, PortkeyModulesEntity } from 'service/native-modules';
import { AcceptableValueType } from './BaseContainer';
import BaseContainerContext from './BaseContainerContext';

const useBaseContainer = (props: BaseContainerHookedProps): BaseContainerHooks => {
  const onShowListener = useRef<EmitterSubscription | null>(null);
  const baseContainerContext = useContext(BaseContainerContext);
  const { containerId, entryName, onShow } = props;

  useEffect(() => {
    if (containerId) {
      onShowListener.current?.remove();
      onShowListener.current = PortkeyDeviceEventEmitter.addListener('onShow', params => {
        const { containerId: nativeContainerId } = params || {};
        if (containerId === nativeContainerId) {
          onShow?.();
        }
      });
    }
    return () => {
      onShowListener.current?.remove();
    };
  }, [onShow, containerId]);

  const getEntryName = useCallback(
    () => entryName ?? baseContainerContext.entryName,
    [entryName, baseContainerContext.entryName],
  );

  const navigationTo = useCallback(
    (entry: PortkeyEntries, targetScene?: string, closeCurrentScreen?: boolean) => {
      PortkeyModulesEntity.RouterModule.navigateTo(
        entry,
        getEntryName(),
        targetScene ?? 'none',
        closeCurrentScreen ?? false,
      );
    },
    [getEntryName],
  );

  const navigateForResult = useCallback(
    <V = VoidResult, T = { [x: string]: AcceptableValueType }>(
      entry: PortkeyEntries,
      options: RouterOptions<T>,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      callback: (res: EntryResult<V>) => void = () => {},
    ) => {
      const { params, closeCurrentScreen, navigationAnimation, navigationAnimationDuration, targetScene } = options;
      PortkeyModulesEntity.RouterModule.navigateToWithOptions(
        entry,
        getEntryName(),
        {
          params: params ?? ({} as any),
          closeCurrentScreen: closeCurrentScreen ?? false,
          navigationAnimation: navigationAnimation ?? 'slide',
          navigationAnimationDuration: navigationAnimationDuration ?? 2000,
          targetScene: targetScene ?? '',
        },
        callback,
      );
    },
    [getEntryName],
  );

  const onFinish = useCallback(<R,>(res: EntryResult<R>) => {
    PortkeyModulesEntity.RouterModule.navigateBack(res);
  }, []);

  const onError = useCallback(
    (err: Error) => {
      PortkeyModulesEntity.NativeWrapperModule.onError(getEntryName(), err.message, { stack: err.stack });
    },
    [getEntryName],
  );

  const onFatal = useCallback(
    (err: Error) => {
      PortkeyModulesEntity.NativeWrapperModule.onFatalError(getEntryName(), err.message, { stack: err.stack });
    },
    [getEntryName],
  );

  const onWarn = useCallback(
    (msg: string) => {
      PortkeyModulesEntity.NativeWrapperModule.onWarning(getEntryName(), msg);
    },
    [getEntryName],
  );

  return useMemo(() => {
    return {
      getEntryName,
      navigationTo,
      navigateForResult,
      onFinish,
      onError,
      onFatal,
      onWarn,
    };
  }, [getEntryName, navigateForResult, navigationTo, onError, onFatal, onFinish, onWarn]);
};

export interface BaseContainerHooks {
  getEntryName: () => string;
  navigationTo: (entry: PortkeyEntries, targetScene?: string) => void;
  navigateForResult: <V = VoidResult, T = { [x: string]: AcceptableValueType }>(
    entry: PortkeyEntries,
    options: RouterOptions<T>,
    callback?: (res: EntryResult<V>) => void,
  ) => void;
  onFinish: <R>(res: EntryResult<R>) => void;
  onError: (err: Error) => void;
  onFatal: (err: Error) => void;
  onWarn: (msg: string) => void;
}

export interface VoidResult {}

export interface BaseContainerHookedProps {
  containerId?: any;
  entryName?: string;
  onShow?: () => void;
}

export default useBaseContainer;
