import { Button, message } from 'antd';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { createWallet, resetWallet, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useTranslation } from 'react-i18next';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { useHardwareBack } from 'hooks/useHardwareBack';
import CommonModal from 'components/CommonModal';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { sendScanLoginSuccess } from '@portkey-wallet/api/api-did/message/utils';
import { SetPinAndAddManager, CreatePendingInfo, DIDWalletInfo } from '@portkey/did-ui-react';
import { AccountType, GuardiansApproved } from '@portkey/services';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import './index.less';

export default function SetWalletPin() {
  const { t } = useTranslation();

  const { type: state } = useParams<{ type: 'login' | 'scan' | 'register' }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const [returnOpen, setReturnOpen] = useState<boolean>();
  const { scanWalletInfo, scanCaWalletInfo, loginAccount, registerVerifier } = useLoginInfo();
  const { userGuardianStatus } = useGuardiansInfo();
  const originChainId = useOriginChainId();

  useEffect(() => {
    if (state === 'scan' && (!scanWalletInfo || !scanCaWalletInfo)) {
      message.error('Wallet information is wrong, please go back to scan the code and try again');
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
        message.error('Wallet information is wrong, please go back to scan the code and try again');
        return;
      }
      dispatch(
        createWallet({
          walletInfo: scanWallet,
          pin,
          caInfo: scanCaWalletInfo,
        }),
      );
      await setLocalStorage({
        registerStatus: 'Registered',
      });
      dispatch(setPasswordSeed(pin));
      scanWallet?.address && sendScanLoginSuccess({ targetClientId: scanWallet.address });
      setPinAction(pin);
      navigate(`/success-page/${state}`);
    },
    [dispatch, navigate, scanCaWalletInfo, scanWalletInfo, state],
  );

  const onFinish = useCallback(
    async (values: string | DIDWalletInfo) => {
      try {
        if (state === 'scan' && typeof values === 'string') return createByScan(values);
        if (typeof values !== 'object') throw values;
        setLoading(true);
        const result = await getHolderInfo({
          chainId: originChainId,
          caHash: values.caInfo.caHash,
        });
        setLoading(false);

        const managerList: any[] = result.managerInfos;

        if (!managerList.find((info) => info?.address === values.walletInfo.address))
          throw `${values.walletInfo.address} is not a manager`;

        dispatch(
          setCAInfo({
            caInfo: values.caInfo,
            pin: values.pin,
            chainId: values.chainId,
          }),
        );
        await setLocalStorage({
          registerStatus: 'Registered',
        });
        const path = state ? 'register' : 'login';
        navigate(`/success-page/${path}`);
      } catch (error: any) {
        await setLocalStorage({
          registerStatus: null,
        });
        dispatch(resetWallet());

        const walletError = isWalletError(error);
        if (walletError) return message.error(walletError);
        message.error(handleErrorMessage(error, 'Create wallet failed'));
      } finally {
        setLoading(false);
      }
    },
    [state, createByScan, originChainId, dispatch, navigate, setLoading],
  );

  const backHandler = useCallback(async () => {
    switch (state) {
      case 'register':
        navigate('/register/select-verifier');
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

  const onCreatePending = useCallback(
    async (info: CreatePendingInfo) => {
      try {
        console.log('onCreatePending:', info);
        const managerInfo: ManagerInfo = {
          managerUniqueId: info.sessionId,
          requestId: info.requestId,
          loginAccount: loginAccount?.guardianAccount as string,
          type: loginAccount?.loginType as LoginType,
          verificationType: state === 'login' ? VerificationType.communityRecovery : VerificationType.register,
        };
        const pin = info.pin;
        dispatch(setPasswordSeed(pin));
        dispatch(
          createWallet({
            walletInfo: info.walletInfo,
            pin,
            caInfo: { managerInfo },
          }),
        );

        await setLocalStorage({
          registerStatus: 'registeredNotGetCaAddress',
        });

        await setPinAction(pin);
      } catch (error) {
        console.log('onCreatePending error:', error);
      }
    },
    [dispatch, loginAccount, state],
  );

  return (
    <div className="common-page set-pin-wrapper" id="set-pin-wrapper">
      <PortKeyTitle leftElement leftCallBack={leftCallBack} />
      <div className="common-content1 set-pin-content">
        <SetPinAndAddManager
          chainId={originChainId}
          onlyGetPin={state === 'scan'}
          isErrorTip
          accountType={LoginType[loginAccount?.loginType as any] as AccountType}
          guardianIdentifier={loginAccount?.guardianAccount as string}
          type={state === 'login' ? 'recovery' : 'register'}
          guardianApprovedList={approvedList}
          onError={(e) => {
            console.log(e, 'setWalletPin');
          }}
          onFinish={onFinish}
          onCreatePending={onCreatePending}
        />
      </div>

      <CommonModal
        closable={false}
        open={returnOpen}
        className="set-pin-modal"
        title={t('Leave this page?')}
        getContainer={'#set-pin-wrapper'}>
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
