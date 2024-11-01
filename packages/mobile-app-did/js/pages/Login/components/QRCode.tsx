import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import AElf from 'aelf-sdk';
import { setCAInfoType, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import useEffectOnce from 'hooks/useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';

import GStyles from 'assets/theme/GStyles';
import { TextH1, TextM } from 'components/CommonText';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { usePin } from 'hooks/store';
import { useIntervalQueryCAInfoByAddress } from '@portkey-wallet/hooks/hooks-ca/graphql';
import CommonPrompt from 'components/CommonPromptCard';
import { handleWalletInfo } from '@portkey-wallet/utils/wallet';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useIsFocused } from '@react-navigation/native';
import { useGetDeviceInfo } from 'hooks/device';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useCheckManager } from 'hooks/useLogOut';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { screenHeight } from '@portkey-wallet/utils/mobile/device';

// When wallet does not exist, DEFAULT_WALLET is populated as the default data
const DEFAULT_WALLET: LoginQRData = {
  chainType: 'aelf',
  type: 'login',
  address: '2Aj8aTMsmgp1YyrVeCvB2dp9DbrLz5zgmAVmKNXsLnxhqzA69L',
  networkType: 'TESTNET',
  extraData: {
    deviceInfo: {
      deviceType: 2,
      deviceName: 'iOS',
    },
    version: '1.0.0',
  },
};

export default function QRCode() {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const dispatch = useAppDispatch();
  const pin = usePin();
  const checkManager = useCheckManager();
  const caWalletInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address, checkManager);
  const isFocused = useIsFocused();
  usePreventScreenCapture('LoginQRCode');
  const comStyles = styles();

  useEffect(() => {
    if (!isFocused) return;
    const { caInfo, originChainId } = caWalletInfo || {};
    if (caInfo && newWallet && originChainId) {
      if (pin) {
        try {
          dispatch(setCAInfoType({ caInfo, pin }));
          navigationService.reset('Tab');
        } catch (error) {
          CommonPrompt.failError(error);
        }
      } else {
        dispatch(setOriginChainId(originChainId));
        navigationService.navigate('SetPin', {
          caInfo,
          walletInfo: handleWalletInfo(newWallet),
          managerInfo: caInfo.managerInfo,
        });
      }
      setNewWallet(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caWalletInfo, dispatch, isFocused, newWallet]);
  const generateWallet = useCallback(() => {
    try {
      const wallet = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [walletInfo]);

  const getDeviceInfo = useGetDeviceInfo();
  useEffectOnce(() => {
    const timer = setTimeout(() => {
      generateWallet();
    }, 10);
    let timer2: any;
    const listener = myEvents.clearQRWallet.addListener(() => {
      timer2 = setTimeout(() => {
        setNewWallet(undefined);
        timer2 && clearTimeout(timer2);
        timer2 = setTimeout(() => {
          generateWallet();
        }, 200);
      }, 500);
    });
    return () => {
      timer && clearTimeout(timer);
      timer2 && clearTimeout(timer2);
      listener.remove();
    };
  });

  const qrData: LoginQRData = useMemo(
    () =>
      newWallet
        ? {
            // TODO: ethereum
            chainType: 'aelf',
            type: 'login',
            address: newWallet.address,
            networkType: currentNetwork,
            id: Math.floor(Date.now() / 1000),
            extraData: {
              deviceInfo: getDeviceInfo(),
              version: DEVICE_INFO_VERSION,
            },
          }
        : DEFAULT_WALLET,
    [currentNetwork, getDeviceInfo, newWallet],
  );
  const qrDataStr = useMemo(() => JSON.stringify(qrData), [qrData]);
  // const clientId = useMemo(() => (qrData.id ? `${qrData.address}_${qrData.id}` : undefined), [qrData]);
  // const isScanQRCode = useIsScanQRCode(clientId);

  return (
    <View style={[comStyles.card, comStyles.qrCodeCard]}>
      <TextH1 style={[comStyles.qrCodeTitle]}>Log in with QR code</TextH1>
      <TextM style={[comStyles.qrCodeDesc]}>Use the Portkey Wallet app on another device to scan the QR code.</TextM>

      <View style={[GStyles.alignCenter, comStyles.qrCodeBox]}>
        <CommonQRCodeStyled qrData={qrDataStr} hasMask={!newWallet} width={pTd(288)} />
      </View>
    </View>
  );
}

const styles = makeStyles(theme => ({
  card: {
    flex: 1,
    width: '100%',
    paddingTop: pTd(24),
    paddingBottom: 0,
    minHeight: Math.min(screenHeight * 0.58, 494),
  },
  qrCodeCard: {
    backgroundColor: theme.colors.bgBase1,
    paddingBottom: 0,
    marginTop: 0,
  },
  qrCodeTitle: {
    marginTop: 0,
    marginBottom: pTd(16),
  },
  qrCodeDesc: {
    color: theme.colors.textBase2,
  },
  qrCodeBox: {
    marginTop: pTd(80),
    backgroundColor: theme.colors.iconBase1,
    padding: pTd(16),
    borderRadius: pTd(16),
    height: pTd(320),
    width: pTd(320),
  },
}));
