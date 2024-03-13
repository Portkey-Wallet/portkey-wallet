import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { EmitterSubscription } from 'react-native';
import { EntryResult, PortkeyDeviceEventEmitter, RouterOptions, PortkeyModulesEntity } from 'service/native-modules';
import { AcceptableValueType } from './BaseContainer';
import BaseContainerContext from './BaseContainerContext';
import { LaunchMode, LaunchModeSet } from 'global/init/entries';
import { wrapEntry } from 'utils/commonUtil';

const useBaseContainer = (props: BaseContainerHookedProps = {}): BaseContainerHooks => {
  const onShowListener = useRef<EmitterSubscription | null>(null);
  const onNewIntentListener = useRef<EmitterSubscription | null>(null);
  const baseContainerContext = useContext(BaseContainerContext);
  const { containerId, entryName, onShow, onNewIntent } = props;
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
    if (onNewIntent) {
      onNewIntentListener.current?.remove();
      onNewIntentListener.current = PortkeyDeviceEventEmitter.addListener('onNewIntent', params => {
        onNewIntent?.(params);
      });
    }
    return () => {
      onShowListener.current?.remove();
      onNewIntentListener.current?.remove();
    };
  }, [onShow, containerId, onNewIntent]);

  const getEntryName = useCallback(() => {
    return entryName ?? baseContainerContext.entryName;
  }, [entryName, baseContainerContext.entryName]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateTo = useCallback(simple_navigateTo_func(getEntryName), [getEntryName]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateForResult = useCallback(simple_navigateForResult_func(getEntryName), [getEntryName]);

  const onFinish = useCallback(
    <R>(res: EntryResult<R>) => {
      PortkeyModulesEntity.RouterModule.navigateBack(res, getEntryName());
    },
    [getEntryName],
  );

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
      navigateTo,
      navigateForResult,
      onFinish,
      onError,
      onFatal,
      onWarn,
    };
  }, [getEntryName, navigateForResult, navigateTo, onError, onFatal, onFinish, onWarn]);
};

export interface BaseContainerHooks {
  getEntryName: () => string;
  navigateTo: <T = { [x: string]: AcceptableValueType }>(
    entry: string,
    option?: {
      params?: T;
      targetScene?: string;
      closeCurrentScreen?: boolean;
    },
  ) => void;
  navigateForResult: <V = VoidResult, T = { [x: string]: AcceptableValueType }>(
    entry: string,
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
  onShow?: (() => void) | (() => Promise<void>);
  onNewIntent?: (params: any) => Promise<void> | void;
}

export const simple_navigateTo_func = (getEntryName?: () => string) => {
  let fromEntryName = 'unknown';
  if (getEntryName) {
    fromEntryName = getEntryName();
  }
  return <T = { [x: string]: AcceptableValueType }>(
    entry: string,
    {
      params = {} as any,
      targetScene = 'none',
      closeCurrentScreen = false,
    }: {
      params?: T;
      targetScene?: string;
      closeCurrentScreen?: boolean;
    } = {},
  ) => {
    PortkeyModulesEntity.RouterModule.navigateTo(
      wrapEntry(entry),
      LaunchModeSet.get(entry) || LaunchMode.STANDARD,
      fromEntryName,
      targetScene ?? 'none',
      closeCurrentScreen ?? false,
      params as any,
    );
  };
};
export const simple_navigateForResult_func = (getEntryName?: () => string) => {
  let fromEntryName = 'unknown';
  if (getEntryName) {
    fromEntryName = getEntryName();
  }
  return <V = VoidResult, T = { [x: string]: AcceptableValueType }>(
    entry: string,
    options: RouterOptions<T>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    callback: (res: EntryResult<V>) => void = () => {},
  ) => {
    const { params, closeCurrentScreen, navigationAnimation, navigationAnimationDuration, targetScene } = options;
    PortkeyModulesEntity.RouterModule.navigateToWithOptions(
      wrapEntry(entry),
      LaunchModeSet.get(entry) || LaunchMode.STANDARD,
      fromEntryName,
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
};
export default useBaseContainer;
