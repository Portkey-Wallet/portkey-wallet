import { WalletInfoType } from '@portkey-wallet/types/wallet';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AElf from 'aelf-sdk';
import { useEffectOnce } from 'react-use';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAppDispatch, useUserInfo } from 'store/Provider/hooks';
import { useIntervalQueryCAInfoByAddress } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { setWalletInfoAction } from 'store/reducers/loginCache/actions';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import { setCAInfoType, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCheckManager } from 'hooks/useLogout';
import { message } from 'antd';
import { ScanBase } from '@portkey/did-ui-react';
import './index.less';

export default function ScanCardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const deviceInfo = useMemo(() => getDeviceInfo(DEVICE_TYPE), []);
  const checkManager = useCheckManager();
  const { passwordSeed: pin } = useUserInfo();
  const caWallet = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address, checkManager);
  const generateKeystore = useCallback(() => {
    try {
      const wallet = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [walletInfo]);

  useEffectOnce(() => {
    const timer = setTimeout(() => {
      generateKeystore();
    }, 10);
    return () => {
      timer && clearTimeout(timer);
    };
  });

  const qrData = useMemo(() => {
    if (!newWallet) return '';
    const data: LoginQRData = {
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork,
      chainType: 'aelf',
      extraData: {
        deviceInfo,
        version: DEVICE_INFO_VERSION,
      },
    };
    return JSON.stringify(data);
  }, [currentNetwork, deviceInfo, newWallet]);

  useEffect(() => {
    const { caInfo, originChainId } = caWallet || {};
    if (caInfo && newWallet && originChainId) {
      if (pin) {
        try {
          dispatch(setCAInfoType({ caInfo, pin }));
          navigate('/success-page/login');
        } catch (error: any) {
          message.error(error);
        }
      } else {
        dispatch(setOriginChainId(originChainId));
        dispatch(
          setWalletInfoAction({
            walletInfo: newWallet,
            caWalletInfo: caInfo,
          }),
        );
        console.log(newWallet, caInfo, 'scanCaWalletInfo===1');
        navigate('/login/set-pin/scan');
      }
    }
  }, [caWallet, dispatch, navigate, newWallet, pin]);

  return (
    <ScanBase
      wrapperClassName="register-scan"
      qrData={qrData}
      backIcon={<CustomSvg type="PC" />}
      onBack={() => navigate('/register/start')}
    />
  );
}
