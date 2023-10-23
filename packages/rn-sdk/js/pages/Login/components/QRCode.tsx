import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { View, Image } from 'react-native';
import AElf from 'aelf-sdk';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextS, TextXXXL } from 'components/CommonText';
import { PageLoginType } from '../types';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { useIntervalQueryCAInfoByAddress } from 'hooks/useIntervalQueryCAInfoByAddress';
import CommonToast from 'components/CommonToast';
import { handleWalletInfo } from '@portkey-wallet/utils/wallet';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import phone from 'assets/image/pngs/phone.png';
import { useGetDeviceInfo } from 'hooks/device';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { usePreventScreenCapture } from 'expo-screen-capture';
import NetworkContext from '../context/NetworkContext';

// When wallet does not exist, DEFAULT_WALLET is populated as the default data
const DEFAULT_WALLET: LoginQRData = {
  chainType: 'aelf',
  type: 'login',
  address: '2Aj8aTMsmgp1YyrVeCvB2dp9DbrLz5zgmAVmKNXsLnxhqzA69L',
  netWorkType: 'TESTNET',
  extraData: {
    deviceInfo: {
      deviceType: 2,
      deviceName: 'iOS',
    },
    version: '1.0.0',
  },
};

export default function QRCode({ setLoginType }: { setLoginType: (type: PageLoginType) => void }) {
  // const { walletInfo, currentNetwork } = useCurrentWallet();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const networkContext = useContext(NetworkContext);
  const currentNetwork = useMemo(() => {
    return networkContext.currentNetwork?.networkType ?? 'MAIN';
  }, [networkContext.currentNetwork?.networkType]);
  // const pin = usePin();
  // const checkManager = useCheckManager();
  const caWalletInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address);
  // const isFocused = useIsFocused();
  usePreventScreenCapture('LoginQRCode');

  useEffect(() => {
    // if (!isFocused) return;
    const { caInfo, originChainId } = caWalletInfo || {};
    if (caInfo && newWallet && originChainId) {
      console.log('log in succ: caInfo', caInfo);
      // if (pin) {
      //   try {
      //     dispatch(setCAInfoType({ caInfo, pin }));
      //     navigationService.reset('Tab');
      //   } catch (error) {
      //     CommonToast.failError(error);
      //   }
      // } else {
      //   dispatch(setOriginChainId(originChainId));
      //   navigationService.navigate('SetPin', {
      //     caInfo,
      //     walletInfo: handleWalletInfo(newWallet),
      //     managerInfo: caInfo.managerInfo,
      //   });
      // }
      setNewWallet(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caWalletInfo, newWallet]);
  const generateWallet = useCallback(() => {
    try {
      const wallet = AElf.wallet.createNewWallet();
      console.log('wallet', wallet);
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
            chainType: 'aelf',
            type: 'login',
            address: newWallet.address,
            netWorkType: currentNetwork,
            id: Math.floor(Date.now() / 1000),
            extraData: {
              deviceInfo: getDeviceInfo(),
              version: DEVICE_INFO_VERSION,
            },
          }
        : DEFAULT_WALLET,
    [getDeviceInfo, newWallet, currentNetwork],
  );
  const qrDataStr = useMemo(() => JSON.stringify(qrData), [qrData]);

  return (
    <View style={[BGStyles.bg1, styles.card, styles.qrCodeCard]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.referral)}>
        <Image source={phone} style={styles.iconStyle} />
      </Touchable>
      <View style={[GStyles.flex1]}>
        <TextXXXL style={[styles.qrCodeTitle, GStyles.textAlignCenter]}>Scan code to log in</TextXXXL>
        <TextS style={[GStyles.textAlignCenter, FontStyles.font3]}>
          Please use the Portkey DApp to scan the QR code
        </TextS>
        <View style={[GStyles.alignCenter, styles.qrCodeBox, GStyles.flex1]}>
          <CommonQRCodeStyled qrData={qrDataStr} hasMask={!newWallet} />
        </View>
      </View>
    </View>
  );
}
