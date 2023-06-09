import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Image } from 'react-native';
import AElf from 'aelf-sdk';
import { setCAInfoType, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextS, TextXXXL } from 'components/CommonText';
import { PageLoginType } from '../types';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { usePin } from 'hooks/store';
import { useIntervalQueryCAInfoByAddress } from '@portkey-wallet/hooks/hooks-ca/graphql';
import CommonToast from 'components/CommonToast';
import { handleWalletInfo } from '@portkey-wallet/utils/wallet';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import phone from 'assets/image/pngs/phone.png';
import { useIsFocused } from '@react-navigation/native';
import { useGetDeviceInfo } from 'hooks/device';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useCheckManager } from 'hooks/useLogOut';

export default function QRCode({ setLoginType }: { setLoginType: (type: PageLoginType) => void }) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const dispatch = useAppDispatch();
  const pin = usePin();
  const checkManager = useCheckManager();
  const caWalletInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address, checkManager);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    const { caInfo, originChainId } = caWalletInfo || {};
    if (caInfo && newWallet && originChainId) {
      if (pin) {
        try {
          dispatch(setCAInfoType({ caInfo, pin }));
          navigationService.reset('Tab');
        } catch (error) {
          CommonToast.failError(error);
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
  const qrData = useMemo(() => {
    if (!newWallet)
      return '{"chainType":"aelf","type":"login","address":"2Aj8aTMsmgp1YyrVeCvB2dp9DbrLz5zgmAVmKNXsLnxhqzA69L","netWorkType":"TESTNET","extraData":{"deviceInfo":{"deviceType":2,"deviceName":"iOS"},"version":"1.0.0"}}';

    const data: LoginQRData = {
      // TODO: ethereum
      chainType: 'aelf',
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork,
      extraData: {
        deviceInfo: getDeviceInfo(),
        version: DEVICE_INFO_VERSION,
      },
    };

    return JSON.stringify(data);
  }, [currentNetwork, getDeviceInfo, newWallet]);

  return (
    <View style={[BGStyles.bg1, styles.card]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.referral)}>
        <Image source={phone} style={styles.iconStyle} />
      </Touchable>
      <TextXXXL style={[styles.qrCodeTitle, GStyles.textAlignCenter]}>Scan code to log in</TextXXXL>
      <TextS style={[GStyles.textAlignCenter, FontStyles.font3]}>Please use the Portkey DApp to scan the QR code</TextS>
      <View style={[GStyles.alignCenter, styles.qrCodeBox]}>
        <CommonQRCodeStyled qrData={qrData} hasMask={!newWallet} />
      </View>
    </View>
  );
}
