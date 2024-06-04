import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AElf from 'aelf-sdk';
import { useEffectOnce } from 'react-use';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAppDispatch } from 'store/Provider/hooks';
import { useIntervalQueryCAInfoByAddress } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { setWalletInfoAction } from 'store/reducers/loginCache/actions';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { DEVICE_INFO_VERSION } from '@portkey-wallet/constants/constants-ca/device';
import { ScanBase } from '@portkey/did-ui-react';
import { setCAInfoType, setOriginChainId } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCheckManager } from 'hooks/useLogout';
import './index.less';
// import didSignalr from '@portkey-wallet/socket/socket-did';
// import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { handleErrorMessage, randomId } from '@portkey-wallet/utils';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import CustomSvg from 'components/CustomSvg';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import googleAnalytics from 'utils/googleAnalytics';
import { LoginMethod } from '@portkey-wallet/types/types-ca/wallet';

export default function ScanCard() {
  const navigate = useNavigateState();
  const dispatch = useAppDispatch();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const deviceInfo = useMemo(() => getDeviceInfo(DEVICE_TYPE), []);
  const checkManager = useCheckManager();
  const caWallet = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address, checkManager);
  // const [isWaitingAuth, setIsWaitingAuth] = useState<boolean>();
  // const networkItem = useCurrentNetworkInfo();

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
      networkType: currentNetwork,
      id: randomId(),
      chainType: 'aelf',
      extraData: {
        deviceInfo,
        version: DEVICE_INFO_VERSION,
      },
    };
    return JSON.stringify(data);
  }, [currentNetwork, deviceInfo, newWallet]);

  // Listen whether the user is authorized
  // useEffect(() => {
  //   try {
  //     const data: LoginQRData = JSON.parse(qrData);
  //     if (!data?.id) return;
  // const clientId = `${data.address}_${data.id}`;
  // didSignalr.onScanLogin(() => {
  //   setIsWaitingAuth(true);
  // });
  // didSignalr.doOpen({ url: `${networkItem.apiUrl}/ca`, clientId }).catch((error) => {
  //   console.warn('Socket:', error);
  // });
  //   } catch (error) {
  //     console.warn('Socket:', error);
  //   }
  // }, [networkItem.apiUrl, qrData]);

  useEffectOnce(() => {
    googleAnalytics.loginStartEvent('Scan');
  });

  useEffect(() => {
    const { caInfo, originChainId } = caWallet || {};
    InternalMessage.payload(InternalMessageTypes.GET_SEED)
      .send()
      .then((getSeedResult) => {
        const pin = getSeedResult.data.privateKey;

        if (caInfo && newWallet && originChainId) {
          if (pin) {
            try {
              dispatch(setCAInfoType({ caInfo, pin }));
              googleAnalytics.loginEndEvent(LoginMethod.Scan);
              navigate('/success-page/login');
            } catch (error: any) {
              singleMessage.error(handleErrorMessage(error));
            }
          } else {
            dispatch(setOriginChainId(originChainId));
            dispatch(
              setWalletInfoAction({
                walletInfo: newWallet,
                caWalletInfo: caInfo,
              }),
            );
            navigate('/login/set-pin/scan');
          }
        }
      });
  }, [caWallet, currentNetwork, dispatch, navigate, newWallet]);

  return (
    <div className="scan-card">
      <ScanBase
        wrapperClassName="scan-card-inner"
        // isWaitingAuth={isWaitingAuth}
        backIcon={<CustomSvg type="PC" />}
        onBack={() => navigate('/register/start')}
        qrData={qrData}
      />
    </div>
  );
}
