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
import { useIntervalQueryCAInfoByAddress } from 'hooks/useIntervalQueryCAInfoByAddress';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useGetDeviceInfo } from 'hooks/device';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { usePreventScreenCapture } from 'expo-screen-capture';
import NetworkContext from '../context/NetworkContext';
import useBaseContainer from 'model/container/UseBaseContainer';
import { SetPinPageResult, SetPinPageProps } from 'pages/Pin/SetPin';
import { PortkeyEntries } from 'config/entries';
import { AfterVerifiedConfig } from 'model/verify/after-verify';
import { WalletInfo } from 'network/dto/wallet';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

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
  const [newWallet, setNewWallet] = useState<WalletInfo>();
  const networkContext = useContext(NetworkContext);
  const currentNetwork = useMemo(() => {
    return networkContext.currentNetwork?.networkType ?? 'MAIN';
  }, [networkContext.currentNetwork?.networkType]);
  const { navigateForResult, onFinish } = useBaseContainer({});
  const caWalletInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address);
  usePreventScreenCapture('LoginQRCode');

  useEffect(() => {
    const { caInfo, originChainId } = caWalletInfo || {};
    if (caInfo && newWallet && originChainId) {
      const { caAddress, caHash } = caInfo[caInfo.originChainId ?? 'AELF'];
      dealWithSetPin({
        scanQRCodePathInfo: {
          caHash: caHash,
          caAddress: caAddress,
          walletInfo: newWallet,
          originalChainId: originChainId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caWalletInfo, newWallet]);

  const dealWithSetPin = (afterVerifiedData: AfterVerifiedConfig | string) => {
    navigateForResult<SetPinPageResult, SetPinPageProps>(
      PortkeyEntries.SET_PIN,
      {
        params: {
          deliveredSetPinInfo:
            typeof afterVerifiedData === 'string' ? afterVerifiedData : JSON.stringify(afterVerifiedData),
        },
      },
      res => {
        const { data } = res;
        if (data.finished) {
          onFinish({
            status: 'success',
            data: {
              finished: true,
            },
          });
        }
      },
    );
  };

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

  const phoneImage = useMemo(() => {
    if (isIOS) {
      return { uri: 'phone' };
    } else {
      return require('assets/image/pngs/phone.png');
    }
  }, []);

  return (
    <View style={[BGStyles.bg1, styles.card, styles.qrCodeCard]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.referral)}>
        <Image source={phoneImage} style={styles.iconStyle} />
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
