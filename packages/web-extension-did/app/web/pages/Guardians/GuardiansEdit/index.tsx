import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useCommonState, useGuardiansInfo, useLoginInfo } from 'store/Provider/hooks';
import CustomSelect from 'pages/components/CustomSelect';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
  setUserGuardianItemStatus,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { isZKLoginSupported, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { OperationTypeEnum, VerifierItem, zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { handleErrorMessage } from '@portkey-wallet/utils';
import GuardianEditPopup from './Popup';
import AccountShow from '../components/AccountShow';
import { getVerifierStatusMap, guardianIconMap, VerifierStatusItem } from '../utils';
import { verification } from 'utils/api';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useSocialVerify } from 'pages/GuardianApproval/hooks/useSocialVerify';
import clsx from 'clsx';
import OptionTip from '../components/SelectOptionTip';
import { verifierExistTip } from '@portkey-wallet/constants/constants-ca/guardian';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TGuardianApprovalLocationState, TVerifierAccountLocationState } from 'types/router';
import BaseGuardianTypeIcon from 'components/BaseGuardianTypeIcon';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';
import './index.less';
import { CustomModalBottom } from '../../components/CustomModalBottom';
import { CustomSvgV3 } from '../../../components/CustomSvgV3';
import { HelpIcon } from '../components/HelpIcon';

export default function GuardiansEdit() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TGuardianApprovalLocationState | TVerifierAccountLocationState>();
  const { verifierMap, currentGuardian, userGuardiansList, preGuardian, opGuardian } = useGuardiansInfo();
  const verifierStatusMap = useMemo(
    () => getVerifierStatusMap(verifierMap, userGuardiansList, preGuardian),
    [preGuardian, userGuardiansList, verifierMap],
  );
  const isZK = useMemo(
    () => preGuardian?.verifiedByZk || preGuardian?.manuallySupportForZk,
    [preGuardian?.manuallySupportForZk, preGuardian?.verifiedByZk],
  );
  const guardiansSaveRef = useRef({ verifierMap, userGuardiansList });
  guardiansSaveRef.current = { verifierMap, userGuardiansList };
  const [selectVal, setSelectVal] = useState<string>(
    opGuardian?.tempToZK
      ? zkLoginVerifierItem.name
      : isZK
      ? zkLoginVerifierItem.name
      : (opGuardian?.verifier?.id as string),
  );
  const [verifierExist, setVerifierExist] = useState<boolean>(false);
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const dispatch = useAppDispatch();
  // const { setLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const { isPrompt } = useCommonState();
  const isPhoneType = useMemo(() => preGuardian?.guardianType === LoginType.Phone, [preGuardian?.guardianType]);
  const isSocialGuardian = useMemo(
    () =>
      preGuardian?.guardianType === LoginType.Google ||
      preGuardian?.guardianType === LoginType.Apple ||
      preGuardian?.guardianType === LoginType.Twitter ||
      preGuardian?.guardianType === LoginType.Facebook ||
      preGuardian?.guardianType === LoginType.Telegram,
    [preGuardian?.guardianType],
  );
  const selectOptions = useMemo(
    () =>
      Object.values(verifierStatusMap ?? {})?.map((item: VerifierStatusItem) => {
        let disabled: boolean;
        if (isZKLoginSupported(preGuardian?.guardianType || 0)) {
          const enabled = item.id === preGuardian?.verifier?.id || item.name === zkLoginVerifierItem.name;
          disabled = !enabled;
        } else {
          disabled = (!!item.isUsed && item.id !== preGuardian?.verifier?.id) || item.name === zkLoginVerifierItem.name;
        }
        return {
          value: item.id || item.name,
          children: (
            <div className={clsx(['flex', 'verifier-option', disabled && 'no-use'])}>
              <BaseVerifierIcon fallback={item.name[0]} src={item.imageUrl} />
              <span className="title">{item.name}</span>
              {/*{selectVal === item.id && <div className="current-tag">{t('Current')}</div>}*/}
              {preGuardian?.verifier?.id === item.id && <div className="current-tag">{t('Current')}</div>}
            </div>
          ),
          disabled,
        };
      }),
    [preGuardian?.guardianType, preGuardian?.verifier?.id, t, verifierStatusMap],
  );
  const originChainId = useOriginChainId();
  const { loginAccount } = useLoginInfo();
  const socialVerify = useSocialVerify();
  const disabled = useMemo(
    () => verifierExist || selectVal === preGuardian?.verifier?.id,
    [verifierExist, selectVal, preGuardian],
  );
  const targetVerifier = useMemo(
    () => Object.values(verifierMap ?? {})?.filter((item: VerifierItem) => item.id === selectVal),
    [selectVal, verifierMap],
  );

  useEffect(() => {
    const temp = userGuardiansList?.find((guardian) => guardian.key === opGuardian?.key);
    if (temp) {
      dispatch(setCurrentGuardianAction(temp));
      dispatch(setOpGuardianAction(temp));
      // dispatch(setPreGuardianAction(temp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGuardiansList]);

  const handleChange = useCallback((value: string) => {
    setVerifierExist(false);
    setSelectVal(value);
  }, []);

  const checkVerifierIsExist = useCallback(async () => {
    try {
      setLoading(true);
      await userGuardianList({ caHash: walletInfo.caHash });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('===guardian edit userGuardianList error', error);
    }
    const { verifierMap, userGuardiansList } = guardiansSaveRef.current;
    const _verifierStatusMap = getVerifierStatusMap(verifierMap, userGuardiansList);
    return Object.values(_verifierStatusMap).some((verifier) => verifier.id === selectVal && verifier.isUsed);
  }, [selectVal, setLoading, userGuardianList, walletInfo.caHash]);

  const guardiansChangeHandler = useCallback(async () => {
    const existFlag: boolean = await checkVerifierIsExist();
    setVerifierExist(existFlag);
    if (existFlag) return;
    try {
      dispatch(
        setLoginAccountAction({
          guardianAccount: opGuardian?.guardianAccount as string,
          loginType: opGuardian?.guardianType as LoginType,
        }),
      );
      setLoading(true);
      dispatch(resetUserGuardianStatus());
      await userGuardianList({ caHash: walletInfo.caHash });
      dispatch(
        setOpGuardianAction({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...opGuardian!,
          key: `${currentGuardian?.guardianAccount}&${selectVal}`,
          verifier: targetVerifier?.[0],
          tempToZK: selectVal === zkLoginVerifierItem.name,
        }),
      );
      setLoading(false);
      navigate('/setting/guardians/guardian-approval', {
        state: {
          previousPage: FromPageEnum.guardiansEdit,
          operationDetails: getOperationDetails(OperationTypeEnum.unsetLoginAccount, {
            identifierHash: preGuardian?.identifierHash as string,
            guardianType: LoginType[opGuardian?.guardianType as LoginType],
            preVerifierId: preGuardian?.verifier?.id || '',
            newVerifierId: opGuardian?.verifier?.id || '',
          }),
        },
      });
    } catch (error: any) {
      setLoading(false);
      console.log('---edit-guardian-error', error);
      singleMessage.error(handleErrorMessage(error));
    }
  }, [
    checkVerifierIsExist,
    currentGuardian?.guardianAccount,
    dispatch,
    navigate,
    opGuardian,
    preGuardian?.identifierHash,
    preGuardian?.verifier?.id,
    selectVal,
    setLoading,
    targetVerifier,
    userGuardianList,
    walletInfo.caHash,
  ]);

  const removeHandler = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: opGuardian?.guardianAccount as string,
        loginType: opGuardian?.guardianType as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    dispatch(
      setCurrentGuardianAction({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...opGuardian!,
      }),
    );
    navigate('/setting/guardians/guardian-approval', {
      state: {
        previousPage: FromPageEnum.guardiansDel,
        operationDetails: getOperationDetails(OperationTypeEnum.deleteGuardian, {
          identifierHash: preGuardian?.identifierHash as string,
          guardianType: LoginType[preGuardian?.guardianType as LoginType],
          verifierId: preGuardian?.verifier?.id || '',
        }),
      },
    });
  }, [
    dispatch,
    opGuardian,
    userGuardianList,
    walletInfo.caHash,
    navigate,
    preGuardian?.identifierHash,
    preGuardian?.guardianType,
    preGuardian?.verifier?.id,
  ]);

  const handleSocialVerify = useCallback(async () => {
    try {
      setLoading(true);
      const operationDetails = getOperationDetails(OperationTypeEnum.unsetLoginAccount, {
        identifierHash: preGuardian?.identifierHash as string,
        guardianType: LoginType[opGuardian?.guardianType as LoginType],
        verifierId: preGuardian?.verifier?.id || '',
      });

      const verifiedInfo = await socialVerify({
        operateGuardian: preGuardian as UserGuardianItem,
        operationType: OperationTypeEnum.unsetLoginAccount,
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
          extra: 'edit',
          operationDetails,
        },
      });
    } catch (error) {
      setLoading(false);
      const _error = handleErrorMessage(error);
      singleMessage.error(_error);
      console.log('===handleSocialVerify error', error);
    }
  }, [
    setLoading,
    socialVerify,
    preGuardian,
    originChainId,
    loginAccount,
    opGuardian?.guardianType,
    dispatch,
    navigate,
  ]);

  const handleCommonVerify = useCallback(async () => {
    try {
      setLoading(true);
      const operationDetails = getOperationDetails(OperationTypeEnum.unsetLoginAccount, {
        identifierHash: preGuardian?.identifierHash as string,
        guardianType: LoginType[opGuardian?.guardianType as LoginType],
        verifierId: preGuardian?.verifier?.id || '',
      });
      const result = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: preGuardian?.guardianAccount as string,
          type: LoginType[opGuardian?.guardianType as LoginType],
          verifierId: preGuardian?.verifier?.id || '',
          chainId: originChainId,
          operationType: OperationTypeEnum.unsetLoginAccount,
          operationDetails,
        },
      });

      setLoading(false);
      if (result.verifierSessionId) {
        dispatch(
          setCurrentGuardianAction({
            ...(preGuardian as UserGuardianItem),
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
            extra: 'edit',
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
  }, [dispatch, navigate, opGuardian?.guardianType, originChainId, preGuardian, setLoading]);

  // unset guardians, then remove
  const unsetLoginGuardian = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: preGuardian?.guardianAccount as string,
        loginType: preGuardian?.guardianType as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
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
    handleCommonVerify,
    handleSocialVerify,
    isPhoneType,
    isPrompt,
    isSocialGuardian,
    opGuardian?.guardianAccount,
    opGuardian?.verifier?.name,
    preGuardian?.guardianAccount,
    preGuardian?.guardianType,
    userGuardianList,
    walletInfo.caHash,
  ]);

  const checkRemove = useCallback(() => {
    const isLoginAccountList = userGuardiansList?.filter((item) => item.isLoginAccount) || [];
    if (opGuardian?.isLoginAccount) {
      if (isLoginAccountList.length === 1) {
        CustomModalBottom({
          isPrompt: true,
          type: 'info',
          content: <>{t('This guardian is the only login account and cannot be removed')}</>,
        });
      } else {
        CustomModalBottom({
          isPrompt,
          type: 'confirm',
          content: (
            <>
              {t(
                'This guardian is currently set as a login account. You need to unset its login account identity before removing it. Please click "Confirm" to proceed.',
              )}
            </>
          ),
          okText: t('Confirm'),
          onOk: unsetLoginGuardian,
        });
      }
    } else {
      CustomModalBottom({
        isPrompt,
        type: 'confirm',
        content: (
          <div>
            <div className="modal-title">{t('Are you sure you want to remove this guardian?')}</div>
            <div>{t("Removing a guardian requires guardians' approval")}</div>
          </div>
        ),
        okText: t('Send Request'),
        onOk: removeHandler,
      });
    }
  }, [userGuardiansList, opGuardian?.isLoginAccount, t, isPrompt, unsetLoginGuardian, removeHandler]);

  const renderContent = useMemo(
    () => (
      <div className="edit-guardian-content flex-column-between flex-1">
        <div>
          <div className="input-item">
            <div className="label">{`Guardian ${LoginType[opGuardian?.guardianType || 0]}`}</div>
            <div className="common-card control">
              <div className="flex-row-center">
                <BaseGuardianTypeIcon type={guardianIconMap[opGuardian?.guardianType || 0]} />
                <AccountShow guardian={opGuardian} />
              </div>
            </div>
          </div>
          <div className="input-item">
            <div className="label flex-row-center verifier-content">
              {t('Verifier')}
              <HelpIcon />
            </div>
            <CustomSelect
              className={clsx('select-network', isZK && 'select-zklogin-verify')}
              value={selectVal}
              onChange={handleChange}
              items={selectOptions}
              customChild={OptionTip()}
              disabled={isZK}
              title={t('Select verifier')}
            />
            {verifierExist && <div className="error">{verifierExistTip}</div>}
          </div>
        </div>
        {!isZK && (
          <div className="btn-wrap">
            {/*<Button className="warning" onClick={checkRemove}>*/}
            {/*  {t('Remove')}*/}
            {/*</Button>*/}
            <Button onClick={guardiansChangeHandler} disabled={isZK || disabled} loading={loading} type="primary">
              {t('Verify with guardian')}
            </Button>
          </div>
        )}
      </div>
    ),
    [
      disabled,
      guardiansChangeHandler,
      handleChange,
      isZK,
      loading,
      opGuardian,
      selectOptions,
      selectVal,
      t,
      verifierExist,
    ],
  );

  return (
    <GuardianEditPopup
      headerTitle={t('Edit Guardians')}
      onBack={() => navigate('/setting/guardians/view')}
      renderContent={renderContent}
      rightElementList={[
        <CustomSvgV3 key="delete" type="delete" className="delete-icon" onClick={checkRemove} fillColor="#EB7D50" />,
      ]}
    />
  );
}
