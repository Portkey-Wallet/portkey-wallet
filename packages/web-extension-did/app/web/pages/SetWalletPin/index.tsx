import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import {
  useCurrentWallet,
  useOriginChainId,
  useOtherNetworkLogged,
  useWallet,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import { createWallet, resetCaInfo, resetWallet, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useTranslation } from 'react-i18next';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { useHardwareBack } from 'hooks/useHardwareBack';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { CAInfoType, LoginMethod, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { sendScanLoginSuccess } from '@portkey-wallet/api/api-did/message/utils';
import './index.less';
import {
  AddManagerType,
  DIDWalletInfo,
  CreatePendingInfo,
  handleErrorMessage,
  OnErrorFunc,
  CommonButton,
  CommonModal,
} from '@portkey/did-ui-react';
import type { AccountType, GuardiansApproved } from '@portkey/services';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import useDistributeLoginFail from 'hooks/useDistributeLoginFail';
import { NetworkType } from '@portkey-wallet/types';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SetPinAndAddManager from 'pages/components/SetPinAndAddManager';
import googleAnalytics from 'utils/googleAnalytics';

export default function SetWalletPin() {
  const { t } = useTranslation();
  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  const loginType: AddManagerType = useMemo(() => (state === 'register' ? 'register' : 'recovery'), [state]);
  const navigate = useNavigateState();
  const dispatch = useAppDispatch();
  const { walletInfo } = useCurrentWallet();
  const [returnOpen, setReturnOpen] = useState<boolean>();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount, registerVerifier } = useLoginInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const originChainId = useOriginChainId();
  const distributeFail = useDistributeLoginFail();
  const { currentNetwork } = useWallet();
  const otherNetworkLogged = useOtherNetworkLogged();
  const [loginAgainModal, setLoginAgainModal] = useState<boolean>();

  console.log(walletInfo, state, scanWalletInfo, scanCaWalletInfo, 'walletInfo===caWallet');

  useEffect(() => {
    if (state === 'scan' && (!scanWalletInfo || !scanCaWalletInfo)) {
      singleMessage.error('Wallet information is wrong, please go back to scan the code and try again');
      navigate('/register/start/scan');
    }
  }, [navigate, scanCaWalletInfo, scanWalletInfo, state]);

  const approvedList: GuardiansApproved[] = useMemo(() => {
    if (state === 'register') {
      return [
        {
          type: LoginType[loginAccount?.loginType as any] as AccountType,
          identifier: loginAccount?.guardianAccount || '',
          verifierId: registerVerifier?.verifierId || '',
          verificationDoc: registerVerifier?.verificationDoc || '',
          signature: registerVerifier?.signature || '',
          zkLoginInfo: registerVerifier?.zkLoginInfo,
        },
      ];
    }
    return Object.values(userGuardianStatus ?? {}).map((guardian) => ({
      type: LoginType[guardian.guardianType] as AccountType,
      identifier: guardian.guardianAccount,
      verifierId: guardian.verifier?.id || '',
      verificationDoc: guardian.verificationDoc || '',
      signature: guardian.signature || '',
      zkLoginInfo: guardian.zkLoginInfo,
    }));
  }, [loginAccount, registerVerifier, state, userGuardianStatus]);

  const createByScan = useCallback(
    async (pin: string) => {
      const scanWallet = scanWalletInfo;
      if (!scanWallet?.address || !scanCaWalletInfo) {
        navigate('/register/start/scan');
        singleMessage.error('Wallet information is wrong, please go back to scan the code and try again');
        return;
      }
      dispatch(
        createWallet({
          walletInfo: scanWallet,
          pin,
          caInfo: scanCaWalletInfo,
        }),
      );

      setPinAction(pin);

      dispatch(setPasswordSeed(pin));
      scanWallet?.address && sendScanLoginSuccess({ targetClientId: scanWallet.address });
      navigate(`/success-page/${state}`);
    },
    [dispatch, navigate, scanCaWalletInfo, scanWalletInfo, state],
  );

  const onCreate = useDebounceCallback(
    async (value: DIDWalletInfo | string) => {
      try {
        try {
          let loginMethod = LoginMethod.SocialRecovery;
          switch (state) {
            case 'register':
              loginMethod = LoginMethod.Signup;
              break;
            case 'scan':
              loginMethod = LoginMethod.Scan;
              break;
            case 'login':
            default:
              loginMethod = LoginMethod.SocialRecovery;
              break;
          }
          googleAnalytics.loginEndEvent(loginMethod);
        } catch (error) {
          console.error('loginEndEvent:', error);
        }

        if (state === 'scan' && typeof value === 'string') {
          return createByScan(value);
        }

        if (typeof value !== 'object') return;
        const result = await getHolderInfo({
          chainId: originChainId,
          caHash: value.caInfo.caHash,
        });

        const managerList: any[] = result.managerInfos;

        if (!managerList.find((info) => info?.address === value.walletInfo.address))
          throw `${value.walletInfo.address} is not a manager`;

        dispatch(
          setCAInfo({
            caInfo: value.caInfo,
            pin: value.pin,
            chainId: value.chainId,
          }),
        );
        navigate(`/success-page/${state}`);
      } catch (error: any) {
        dispatch(resetWallet());

        const walletError = isWalletError(error);
        if (walletError) return singleMessage.error(walletError);
        singleMessage.error(handleErrorMessage(error, 'Create wallet failed'));
      }
    },
    [state, originChainId, dispatch, navigate, createByScan],
    500,
  );

  const pendingInfo = useRef<{ walletInfo?: any; pin: string; networkType?: NetworkType; caInfo?: CAInfoType }>();

  const onCreatePending = useCallback(
    async (info: CreatePendingInfo) => {
      navigate(`/prepare-wallet/${state}`);
      try {
        const verificationType = state === 'login' ? VerificationType.communityRecovery : VerificationType.register;
        const managerInfo = {
          managerUniqueId: info.sessionId,
          requestId: info.requestId,
          loginAccount: loginAccount?.guardianAccount as string,
          type: loginAccount?.loginType as LoginType,
          verificationType,
        };

        const pin = info.pin;
        const walletPendingData = {
          walletInfo: info.walletInfo,
          pin,
          caInfo: { managerInfo },
        };
        pendingInfo.current = walletPendingData;
        dispatch(setPasswordSeed(pin));
        dispatch(createWallet(walletPendingData));
        await setPinAction(pin);
      } catch (error) {
        console.log('onCreatePending error:', error);
      }
    },
    [dispatch, loginAccount?.guardianAccount, loginAccount?.loginType, navigate, state],
  );

  const backHandler = useCallback(() => {
    switch (state) {
      case 'register':
      case 'login':
        navigate('/register/start');
        break;
      case 'scan':
        navigate('/register/start/scan');
        break;
      default:
        navigate(-1);
    }
  }, [navigate, state]);

  const leftCallBack = useCallback(() => {
    if (state === 'register') return setReturnOpen(true);
    backHandler();
  }, [backHandler, state]);

  useHardwareBack(() => {
    if (state === 'register') {
      leftCallBack();
      return;
    }
    backHandler();
  });

  const onError: OnErrorFunc = useCallback(
    async (error) => {
      try {
        if (!pendingInfo.current) return;
        const errorString = handleErrorMessage(error.error);
        if (errorString?.includes('ManagerInfo exists')) {
          googleAnalytics.loginEndEvent(state === 'login' ? LoginMethod.SocialRecovery : LoginMethod.Signup);

          const isSuccess = await distributeFail({
            messageStr: errorString,
            managerAddress: pendingInfo.current.walletInfo.address,
            currentNetwork,
            pin: pendingInfo.current.pin,
            verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
          });
          if (isSuccess) return;
        }
        throw errorString;
      } catch (error) {
        if (otherNetworkLogged) {
          dispatch(resetCaInfo(currentNetwork));
        } else {
          dispatch(resetWallet());
        }
        const walletError = isWalletError(error);
        if (walletError) return singleMessage.error(walletError);
        setLoginAgainModal(true);
      }
    },
    [currentNetwork, dispatch, distributeFail, otherNetworkLogged, state],
  );

  return (
    <div className="set-wallet-pin" id="set-wallet-pin">
      <PortKeyTitle
        hidePortKeyLogo
        leftElement={state !== 'login'}
        leftCallBack={leftCallBack}
        renderContent={
          <>
            <div className="set-pin-header">{`Create a PIN to protect your wallet`}</div>
            <div className="set-pin-content">
              <SetPinAndAddManager
                accountType={LoginType[loginAccount?.loginType as LoginType] as AccountType}
                type={loginType}
                chainId={originChainId}
                onlyGetPin={state === 'scan'}
                guardianApprovedList={approvedList}
                guardianIdentifier={loginAccount?.guardianAccount}
                onFinish={onCreate}
                onCreatePending={onCreatePending}
                onError={onError}
              />
            </div>

            <CommonModal open={returnOpen} getContainer={'#set-wallet-pin'}>
              <div className="padding-16 flex-column">
                <div className="back-modal-title">{t('Leave this page?')}</div>
                <div className="modal-content">{t('returnTip')}</div>
                <div className="btn-wrapper flex-row-center gap-16">
                  <CommonButton type="outline" block onClick={() => setReturnOpen(false)}>
                    No
                  </CommonButton>
                  <CommonButton type="primary" block onClick={backHandler}>
                    Yes
                  </CommonButton>
                </div>
              </div>
            </CommonModal>

            <CommonModal open={loginAgainModal} getContainer={'#set-wallet-pin'}>
              <div className="padding-16 gap-24 flex-column">
                <div className="modal-content">{t('Wallet account recovery failed. Please try again.')}</div>
                <div className="btn-wrapper">
                  <CommonButton
                    type="primary"
                    block
                    onClick={() => {
                      navigate('/register/start');
                      setLoginAgainModal(false);
                    }}>
                    {`Log in again`}
                  </CommonButton>
                </div>
              </div>
            </CommonModal>
          </>
        }
      />
    </div>
  );
}
