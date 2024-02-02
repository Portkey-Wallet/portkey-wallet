import { Button } from 'antd';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
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
import { CAInfoType, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { sendScanLoginSuccess } from '@portkey-wallet/api/api-did/message/utils';
import ModalTip from 'pages/components/ModalTip';
import './index.less';
import {
  AddManagerType,
  DIDWalletInfo,
  CreatePendingInfo,
  handleErrorMessage,
  OnErrorFunc,
} from '@portkey/did-ui-react';
import type { AccountType, GuardiansApproved } from '@portkey/services';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import CommonModal from 'components/CommonModal';
import useDistributeLoginFail from 'hooks/useDistributeLoginFail';
import { NetworkType } from '@portkey-wallet/types';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SetPinAndAddManager from 'pages/components/SetPinAndAddManager';

export default function SetWalletPin() {
  const { t } = useTranslation();
  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  const loginType: AddManagerType = useMemo(() => (state === 'register' ? 'register' : 'recovery'), [state]);
  const navigate = useNavigateState();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const [returnOpen, setReturnOpen] = useState<boolean>();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount, registerVerifier } = useLoginInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const originChainId = useOriginChainId();
  const distributeFail = useDistributeLoginFail();
  const { currentNetwork } = useWallet();
  const otherNetworkLogged = useOtherNetworkLogged();

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
        },
      ];
    }
    return Object.values(userGuardianStatus ?? {}).map((guardian) => ({
      type: LoginType[guardian.guardianType] as AccountType,
      identifier: guardian.guardianAccount,
      verifierId: guardian.verifier?.id || '',
      verificationDoc: guardian.verificationDoc || '',
      signature: guardian.signature || '',
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
        if (state === 'scan' && typeof value === 'string') return createByScan(value);
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
        setLoading(false);

        ModalTip({
          content: 'Requested successfully',
        });
      } catch (error: any) {
        dispatch(resetWallet());
        setLoading(false);

        const walletError = isWalletError(error);
        if (walletError) return singleMessage.error(walletError);
        singleMessage.error(handleErrorMessage(error, 'Create wallet failed'));
      } finally {
        setLoading(false);
      }
    },
    [state, createByScan, originChainId, dispatch, navigate, setLoading],
    500,
  );

  const pendingInfo = useRef<{ walletInfo?: any; pin: string; networkType?: NetworkType; caInfo?: CAInfoType }>();

  const onCreatePending = useCallback(
    async (info: CreatePendingInfo) => {
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
    [dispatch, loginAccount?.guardianAccount, loginAccount?.loginType, state],
  );

  const backHandler = useCallback(async () => {
    switch (state) {
      case 'register':
        navigate('/register/start/create');
        break;
      case 'login':
        navigate('/login/guardian-approval');
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
          const isSuccess = await distributeFail({
            messageStr: errorString,
            managerAddress: pendingInfo.current.walletInfo.address,
            currentNetwork,
            pin: pendingInfo.current.pin,
            verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
          });
          if (isSuccess) {
            ModalTip({
              content: 'Requested successfully',
            });
            return;
          }
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
        singleMessage.error(handleErrorMessage(error, 'Create wallet failed'));
        navigate('/register/start');
      }
    },
    [currentNetwork, dispatch, distributeFail, navigate, otherNetworkLogged, state],
  );

  return (
    <div className="common-page set-wallet-pin" id="set-wallet-pin">
      <PortKeyTitle leftElement={state !== 'login'} leftCallBack={leftCallBack} />
      <div className="common-content1 set-pin-content">
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

      <CommonModal
        closable={false}
        open={returnOpen}
        title={t('Leave this page?')}
        getContainer={'#set-wallet-pin'}
        width={320}>
        <p className="modal-content">{t('returnTip')}</p>
        <div className="btn-wrapper">
          <Button onClick={() => setReturnOpen(false)}>No</Button>
          <Button type="primary" onClick={backHandler}>
            Yes
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
