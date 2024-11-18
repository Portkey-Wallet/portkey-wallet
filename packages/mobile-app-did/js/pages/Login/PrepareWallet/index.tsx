import { Image } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { PrepareWalletProgress, PrepareWalletProgressInterface } from './components/PrepareWalletProgress';
import { CAInfo, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useIntervalGetResult, useOnResultFail } from 'hooks/login';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { TimerResult } from 'utils/wallet';
import { useAppDispatch } from 'store/hooks';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useLatestRef } from '@portkey-wallet/hooks';
import navigationService from 'utils/navigationService';
import { sleep } from '@portkey-wallet/utils';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';

type RouterParams = {
  managerInfo: ManagerInfo;
  isRecovery?: boolean;
  confirmPin: string;
};

export default function PrepareWallet() {
  const styles = getStyles();
  const prepareWalletProgressRef = useRef<PrepareWalletProgressInterface>();
  const { managerInfo, isRecovery, confirmPin } = useRouterParams<RouterParams>();
  const timer = useRef<TimerResult>();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const latestOriginChainId = useLatestRef(originChainId);
  const onResultFail = useOnResultFail();
  usePreventHardwareBack();

  const onIntervalGetResult = useIntervalGetResult();

  const init = useCallback(() => {
    timer.current = onIntervalGetResult({
      managerInfo: managerInfo,
      onPass: async (caInfo: CAInfo) => {
        prepareWalletProgressRef.current?.complete();
        await sleep(700);

        // if (isRecovery) CommonToast.success('Wallet Recovered Successfully!');

        try {
          dispatch(
            setCAInfo({
              caInfo,
              pin: confirmPin,
              chainId: latestOriginChainId.current,
            }),
          );
          navigationService.reset('Tab');
        } catch (error) {
          console.log(error, '=======error');
        }
      },
      onFail: (message: string) => onResultFail(message, isRecovery, true),
    });
  }, [confirmPin, dispatch, isRecovery, latestOriginChainId, managerInfo, onIntervalGetResult, onResultFail]);
  const initRef = useRef(init);
  initRef.current = init;

  useEffect(() => {
    initRef.current();
    return () => {
      timer.current?.remove();
    };
  }, []);

  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      noLeftDom
      hideHeader
      notHandleHardwareBackPress
      hideTouchable>
      <Image source={require('assets/image/pngs/prepare-wallet.png')} style={styles.imageStyle} resizeMode="cover" />
      <PrepareWalletProgress ref={prepareWalletProgressRef} />
    </PageContainer>
  );
}

const getStyles = makeStyles(_theme => ({
  containerStyle: {
    paddingBottom: pTd(16),
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: pTd(409),
    marginBottom: pTd(48),
  },
}));
