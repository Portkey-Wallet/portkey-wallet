import { Button, Switch } from 'antd';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
  setUserGuardianItemStatus,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { handleErrorMessage } from '@portkey-wallet/utils';
import useGuardianList from 'hooks/useGuardianList';
import { verification } from 'utils/api';
import GuardianViewPrompt from './Prompt';
import GuardianViewPopup from './Popup';
import CustomModal from '../../components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import AccountShow from '../components/AccountShow';
import { guardianIconMap } from '../utils';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import singleMessage from 'utils/singleMessage';
import './index.less';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TGuardianApprovalLocationState, TVerifierAccountLocationState } from 'types/router';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import { getGuardianTypeLabel } from '@portkey-wallet/utils/guardian';

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TVerifierAccountLocationState | TGuardianApprovalLocationState>();
  const getGuardianList = useGuardianList();
  const { currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const originChainId = useOriginChainId();
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const editable = useMemo(() => Object.keys(userGuardiansList ?? {}).length > 1, [userGuardiansList]);
  const isPhoneType = useMemo(() => opGuardian?.guardianType === LoginType.Phone, [opGuardian?.guardianType]);
  const operationType = useMemo(
    () => (opGuardian?.isLoginAccount ? OperationTypeEnum.unsetLoginAccount : OperationTypeEnum.setLoginAccount),
    [opGuardian?.isLoginAccount],
  );
  const socialVerify = useSocialVerify();
  const { loginAccount } = useLoginInfo();
  const isSocialGuardian = useMemo(
    () =>
      opGuardian?.guardianType === LoginType.Google ||
      opGuardian?.guardianType === LoginType.Apple ||
      opGuardian?.guardianType === LoginType.Twitter ||
      opGuardian?.guardianType === LoginType.Facebook ||
      opGuardian?.guardianType === LoginType.Telegram,
    [opGuardian?.guardianType],
  );
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, walletInfo.caHash]);

  useEffect(() => {
    const temp = userGuardiansList?.find((guardian) => guardian.key === opGuardian?.key);
    if (temp) {
      dispatch(setCurrentGuardianAction(temp));
      dispatch(setOpGuardianAction(temp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGuardiansList]);

  const handleSocialVerify = useCallback(async () => {
    try {
      setLoading(true);

      const verifiedInfo = await socialVerify({
        operateGuardian: opGuardian as UserGuardianItem,
        operationType,
        originChainId,
        loginAccount,
        targetChainId: originChainId,
      });
      verifiedInfo && dispatch(setUserGuardianItemStatus(verifiedInfo));

      setLoading(false);
      navigate('/setting/guardians/guardian-approval', {
        state: {
          previousPage: FromPageEnum.guardiansLoginGuardian,
        },
      });
    } catch (error) {
      setLoading(false);
      const _error = handleErrorMessage(error);
      singleMessage.error(_error);
      console.log('===handleSocialVerify error', error);
    }
  }, [setLoading, socialVerify, opGuardian, operationType, originChainId, loginAccount, dispatch, navigate]);

  const handleCommonVerify = useCallback(async () => {
    try {
      setLoading(true);
      const result = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: opGuardian?.guardianAccount as string,
          type: LoginType[opGuardian?.guardianType as LoginType],
          verifierId: opGuardian?.verifier?.id || '',
          chainId: originChainId,
          operationType: operationType,
        },
      });

      setLoading(false);
      if (result.verifierSessionId) {
        dispatch(
          setCurrentGuardianAction({
            ...(opGuardian as UserGuardianItem),
            verifierInfo: {
              sessionId: result.verifierSessionId,
              endPoint: result.endPoint,
            },
            isInitStatus: true,
          }),
        );
        navigate('/setting/guardians/verifier-account', {
          state: {
            previousPage: FromPageEnum.guardiansLoginGuardian,
          },
        });
      } else {
        const _error = handleErrorMessage(result, 'send code error');
        singleMessage.error(_error);
        console.log('===handleCommonVerify error', result);
      }
    } catch (error) {
      setLoading(false);
      const _error = handleErrorMessage(error);
      singleMessage.error(_error);
      console.log('===handleCommonVerify error', error);
    }
  }, [dispatch, navigate, opGuardian, operationType, originChainId, setLoading]);

  const handleSwitch = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: opGuardian?.guardianAccount as string,
        loginType: opGuardian?.guardianType as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await getGuardianList({ caHash: walletInfo.caHash });
    dispatch(setCurrentGuardianAction(opGuardian as UserGuardianItem));
    if (isSocialGuardian) {
      handleSocialVerify();
    } else {
      CustomModal({
        type: 'confirm',
        okText: 'Confirm',
        content: (
          <p>
            {`${opGuardian?.verifier?.name ?? ''} will send a verification code to `}
            <strong>{opGuardian?.guardianAccount}</strong>
            {` to verify your ${isPhoneType ? 'phone number' : 'email address'}.`}
          </p>
        ),
        onOk: handleCommonVerify,
      });
    }
  }, [
    dispatch,
    getGuardianList,
    handleCommonVerify,
    handleSocialVerify,
    isPhoneType,
    isSocialGuardian,
    opGuardian,
    walletInfo.caHash,
  ]);

  const checkSwitch = useThrottleCallback(
    async (status: boolean) => {
      setBtnLoading(true);
      if (status) {
        // set login guardian
        const isLogin = Object.values(userGuardiansList ?? {}).some(
          (item: UserGuardianItem) => item.isLoginAccount && item.guardianAccount === currentGuardian?.guardianAccount,
        );
        if (isLogin) {
          setBtnLoading(false);
          handleSwitch();
          return;
        }
        try {
          await getHolderInfo({
            chainId: originChainId,
            guardianIdentifier: opGuardian?.guardianAccount,
          });
          CustomModal({
            type: 'info',
            okText: 'Close',
            content: <>{t('This account address is already a login account and cannot be used')}</>,
          });
        } catch (error: any) {
          if (error?.error?.code?.toString() === '3002') {
            handleSwitch();
          } else {
            const _err = handleErrorMessage(error, 'GetHolderInfo error');
            console.log('===set/unset login guardian getHolderInfo error', error);
            singleMessage.error(_err);
          }
        } finally {
          setBtnLoading(false);
        }
      } else {
        // unset login guardian
        let loginAccountNum = 0;
        userGuardiansList?.forEach((item) => {
          if (item.isLoginAccount) loginAccountNum++;
        });
        if (loginAccountNum > 1) {
          handleSwitch();
        } else {
          CustomModal({
            type: 'info',
            okText: 'Close',
            content: <>{t('This guardian is the only login account and cannot be turned off')}</>,
          });
        }
        setBtnLoading(false);
      }
    },
    [currentGuardian?.guardianAccount, handleSwitch, opGuardian?.guardianAccount, originChainId, t, userGuardiansList],
  );

  const onBack = useCallback(() => {
    navigate('/setting/guardians');
  }, [navigate]);

  const headerTitle = useMemo(() => 'Guardians', []);

  const renderContent = useMemo(
    () => (
      <div className="guardian-view-content flex-column-between flex-1">
        <div>
          <div className="input-content">
            <div className="input-item">
              <div className="label">{`Guardian ${getGuardianTypeLabel(
                LoginType[opGuardian?.guardianType || 0],
              )}`}</div>
              <div className="control">
                <BaseGuardianTypeIcon type={guardianIconMap[opGuardian?.guardianType || 0]} />
                <AccountShow guardian={opGuardian} />
              </div>
            </div>
            {currentGuardian?.guardianType !== LoginType.TonWallet && (
              <div className="input-item">
                <div className="label">{t('Verifier')}</div>
                <div className="control">
                  <BaseVerifierIcon src={opGuardian?.verifier?.imageUrl} fallback={opGuardian?.verifier?.name[0]} />
                  <span className="name">{opGuardian?.verifier?.name ?? ''}</span>
                </div>
              </div>
            )}
          </div>
          <div className="login-content">
            <span className="label">{t('Login account')}</span>
            <span className="value">{t('The login account will be able to log in and control all your assets')}</span>
            <div className="status-wrap">
              <Switch
                className="login-switch"
                checked={opGuardian?.isLoginAccount}
                loading={btnLoading}
                onChange={checkSwitch}
              />
              <span className="status">{opGuardian?.isLoginAccount ? 'Open' : 'Close'}</span>
            </div>
          </div>
        </div>
        <div className="btn-wrap" style={{ display: editable ? '' : 'none' }}>
          <Button
            onClick={() => {
              dispatch(setPreGuardianAction(opGuardian));
              navigate('/setting/guardians/edit');
            }}
            type="primary">
            {t('Edit')}
          </Button>
        </div>
      </div>
    ),
    [opGuardian, t, btnLoading, checkSwitch, editable, dispatch, navigate],
  );

  const props = useMemo(
    () => ({
      headerTitle,
      renderContent,
      onBack,
    }),
    [headerTitle, onBack, renderContent],
  );

  return isNotLessThan768 ? <GuardianViewPrompt {...props} /> : <GuardianViewPopup {...props} />;
}
