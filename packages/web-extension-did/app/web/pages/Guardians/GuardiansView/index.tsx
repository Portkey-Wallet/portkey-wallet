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
import GuardianViewPopup from './Popup';
import { CustomModalBottom, ICustomModalBottomProps } from '../../components/CustomModalBottom';
import { useCommonState } from 'store/Provider/hooks';
import AccountShow from '../components/AccountShow';
import { guardianIconMap } from '../utils';
import { OperationTypeEnum, zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import singleMessage from 'utils/singleMessage';
import './index.less';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TGuardianApprovalLocationState, TVerifierAccountLocationState } from 'types/router';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';
import MenuItem from '../../../components/MenuItem';

export default function GuardiansView() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TVerifierAccountLocationState | TGuardianApprovalLocationState>();
  const getGuardianList = useGuardianList();
  const { currentGuardian, opGuardian, userGuardiansList } = useGuardiansInfo();
  const originChainId = useOriginChainId();
  const { isPrompt } = useCommonState();
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

  const isTheOnlyLoginAccount = useMemo(() => {
    let loginAccountNum = 0;
    userGuardiansList?.forEach((item) => {
      if (item.isLoginAccount) loginAccountNum++;
    });
    return loginAccountNum === 1;
  }, [userGuardiansList]);

  const isZK = useMemo(
    () => opGuardian?.verifiedByZk || opGuardian?.manuallySupportForZk,
    [opGuardian?.manuallySupportForZk, opGuardian?.verifiedByZk],
  );

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
      const operationDetails = getOperationDetails(operationType, {
        identifierHash: opGuardian?.identifierHash as string,
        guardianType: LoginType[opGuardian?.guardianType as LoginType],
        verifierId: opGuardian?.verifier?.id || '',
      });

      const verifiedInfo = await socialVerify({
        operateGuardian: opGuardian as UserGuardianItem,
        operationType,
        originChainId,
        loginAccount,
        targetChainId: originChainId,
        operationDetails,
      });
      verifiedInfo && dispatch(setUserGuardianItemStatus(verifiedInfo));

      setLoading(false);
      navigate('/setting/guardians/guardian-approval', {
        state: {
          previousPage: FromPageEnum.guardiansLoginGuardian,
          operationDetails,
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
      const operationDetails = getOperationDetails(operationType, {
        identifierHash: opGuardian?.identifierHash as string,
        guardianType: LoginType[opGuardian?.guardianType as LoginType],
        verifierId: opGuardian?.verifier?.id || '',
      });
      const result = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: opGuardian?.guardianAccount as string,
          type: LoginType[opGuardian?.guardianType as LoginType],
          verifierId: opGuardian?.verifier?.id || '',
          chainId: originChainId,
          operationType: operationType,
          operationDetails,
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
            operationDetails,
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
      CustomModalBottom({
        isPrompt,
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
    isPrompt,
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
        const alreadyAsLoginParams: ICustomModalBottomProps = {
          isPrompt,
          type: 'info',
          okText: 'OK',
          content: (
            <>
              <div className="title">Already used as login account</div>
              {t(
                `This account is already set as a login account for other wallet(s) and can't be used for this purpose.`,
              )}
            </>
          ),
        };
        try {
          await getHolderInfo({
            chainId: originChainId,
            guardianIdentifier: opGuardian?.guardianAccount,
          });
          CustomModalBottom(alreadyAsLoginParams);
        } catch (error: any) {
          if (error?.error?.code?.toString() === '3002') {
            handleSwitch();
          } else {
            console.log('===set/unset login guardian getHolderInfo error', error);
            CustomModalBottom(alreadyAsLoginParams);
          }
        } finally {
          setBtnLoading(false);
        }
      } else {
        if (!isTheOnlyLoginAccount) {
          handleSwitch();
        } else {
          CustomModalBottom({
            isPrompt,
            type: 'info',
            okText: 'OK',
            content: <>{t('This guardian is the only login account and cannot be turned off')}</>,
          });
        }
        setBtnLoading(false);
      }
    },
    [
      currentGuardian?.guardianAccount,
      handleSwitch,
      isPrompt,
      isTheOnlyLoginAccount,
      opGuardian?.guardianAccount,
      originChainId,
      t,
      userGuardiansList,
    ],
  );

  const renderContent = useMemo(
    () => (
      <div className="guardian-view-content flex-column-between flex-1">
        <div>
          <div className="common-card">
            <div className="title title-container">
              <div className="flex-row-center">{t('Login account')}</div>
              <div>
                <Switch
                  className="login-switch"
                  checked={opGuardian?.isLoginAccount}
                  loading={btnLoading}
                  onChange={checkSwitch}
                  disabled={isTheOnlyLoginAccount && opGuardian?.isLoginAccount}
                />
              </div>
            </div>
            <div className="sub-content">{t('The login account can access and control all your assets.')}</div>
          </div>
          <MenuItem height={54} showEnterIcon={false}>
            <div className="flex-between">
              <div className="label">{t('Guardian')}</div>
              <div className="desc control">
                <BaseGuardianTypeIcon type={guardianIconMap[opGuardian?.guardianType || 0]} />
                {LoginType[opGuardian?.guardianType || 0]}
              </div>
            </div>
          </MenuItem>
          <MenuItem height={74} showEnterIcon={false}>
            <div className="flex-between">
              <div className="label">{t('Guardian account')}</div>
              <div className="desc control">
                <AccountShow guardian={opGuardian} />
              </div>
            </div>
          </MenuItem>
          <MenuItem height={54} showEnterIcon={false}>
            <div className="flex-between">
              <div className="label">{t('Verifier')}</div>
              <div className="desc control">
                <BaseVerifierIcon
                  src={isZK ? zkLoginVerifierItem.imageUrl : currentGuardian?.verifier?.imageUrl}
                  fallback={isZK ? zkLoginVerifierItem.name[0] : currentGuardian?.verifier?.name[0]}
                />
                <span className="name">{isZK ? zkLoginVerifierItem.name : currentGuardian?.verifier?.name ?? ''}</span>
              </div>
            </div>
          </MenuItem>
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
    [
      t,
      opGuardian,
      btnLoading,
      checkSwitch,
      isTheOnlyLoginAccount,
      isZK,
      currentGuardian?.verifier?.imageUrl,
      currentGuardian?.verifier?.name,
      editable,
      dispatch,
      navigate,
    ],
  );

  return (
    <GuardianViewPopup
      headerTitle="Guardian Detail"
      renderContent={renderContent}
      onBack={() => navigate('/setting/guardians')}
    />
  );
}
