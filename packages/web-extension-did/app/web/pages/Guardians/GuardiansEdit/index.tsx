import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import CustomSelect from 'pages/components/CustomSelect';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
  setUserGuardianItemStatus,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { LoginType, isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { OperationTypeEnum, VerifierItem, zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { handleErrorMessage } from '@portkey-wallet/utils';
import GuardianEditPrompt from './Prompt';
import GuardianEditPopup from './Popup';
import CustomModal from '../../components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import AccountShow from '../components/AccountShow';
import { VerifierStatusItem, getVerifierStatusMap, guardianIconMap } from '../utils';
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
import './index.less';

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
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();
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
        let disabled = false;
        if (isZKLoginSupported(preGuardian?.guardianType || 0)) {
          const abled = item.id === preGuardian?.verifier?.id || item.name === zkLoginVerifierItem.name;
          disabled = !abled;
        } else {
          disabled = (!!item.isUsed && item.id !== preGuardian?.verifier?.id) || item.name === zkLoginVerifierItem.name;
        }
        return {
          value: item.id || item.name,
          children: (
            <div className={clsx(['flex', 'verifier-option', disabled && 'no-use'])}>
              <BaseVerifierIcon fallback={item.name[0]} src={item.imageUrl} />
              <span className="title">{item.name}</span>
            </div>
          ),
          disabled,
        };
      }),
    [preGuardian?.guardianType, preGuardian?.verifier?.id, verifierStatusMap],
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
      dispatch(setPreGuardianAction(temp));
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
    const _verifierIsExist = Object.values(_verifierStatusMap).some(
      (verifier) => verifier.id === selectVal && verifier.isUsed,
    );
    return _verifierIsExist;
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
      },
    });
  }, [opGuardian, dispatch, navigate, userGuardianList, walletInfo.caHash]);

  const handleSocialVerify = useCallback(async () => {
    try {
      setLoading(true);

      const verifiedInfo = await socialVerify({
        operateGuardian: preGuardian as UserGuardianItem,
        operationType: OperationTypeEnum.unsetLoginAccount,
        originChainId,
        loginAccount,
        targetChainId: originChainId,
      });
      verifiedInfo && dispatch(setUserGuardianItemStatus(verifiedInfo));

      setLoading(false);
      navigate('/setting/guardians/guardian-approval', {
        state: {
          previousPage: FromPageEnum.guardiansLoginGuardian,
          extra: 'edit',
        },
      });
    } catch (error) {
      setLoading(false);
      const _error = handleErrorMessage(error);
      singleMessage.error(_error);
      console.log('===handleSocialVerify error', error);
    }
  }, [setLoading, socialVerify, preGuardian, originChainId, loginAccount, dispatch, navigate]);

  const handleCommonVerify = useCallback(async () => {
    try {
      setLoading(true);
      const result = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: preGuardian?.guardianAccount as string,
          type: LoginType[opGuardian?.guardianType as LoginType],
          verifierId: preGuardian?.verifier?.id || '',
          chainId: originChainId,
          operationType: OperationTypeEnum.unsetLoginAccount,
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
    handleCommonVerify,
    handleSocialVerify,
    isPhoneType,
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
        CustomModal({
          type: 'info',
          content: <>{t('This guardian is the only login account and cannot be removed')}</>,
        });
      } else {
        CustomModal({
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
      CustomModal({
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
  }, [opGuardian?.isLoginAccount, removeHandler, unsetLoginGuardian, t, userGuardiansList]);

  const renderContent = useMemo(
    () => (
      <div className="edit-guardian-content flex-column-between flex-1">
        <div>
          <div className="input-item">
            <div className="label">{`Guardian ${LoginType[opGuardian?.guardianType || 0]}`}</div>
            <div className="control">
              <BaseGuardianTypeIcon type={guardianIconMap[opGuardian?.guardianType || 0]} />
              <AccountShow guardian={opGuardian} />
            </div>
          </div>
          <div className="input-item">
            <p className="label">{t('Verifier')}</p>
            <CustomSelect
              className={clsx('select', isZK && 'select-zklogin-verify')}
              value={selectVal}
              onChange={handleChange}
              items={selectOptions}
              customChild={OptionTip()}
            />
            {verifierExist && <div className="error">{verifierExistTip}</div>}
          </div>
        </div>
        <div className="btn-wrap">
          <Button className="warning" onClick={checkRemove}>
            {t('Remove')}
          </Button>
          <Button onClick={guardiansChangeHandler} disabled={disabled} type="primary">
            {t('Send Request')}
          </Button>
        </div>
      </div>
    ),
    [
      checkRemove,
      disabled,
      guardiansChangeHandler,
      handleChange,
      isZK,
      opGuardian,
      selectOptions,
      selectVal,
      t,
      verifierExist,
    ],
  );
  const headerTitle = useMemo(() => t('Edit Guardians'), [t]);
  const onBack = useCallback(() => {
    navigate('/setting/guardians/view');
  }, [navigate]);
  const props = useMemo(
    () => ({
      headerTitle,
      onBack,
      renderContent,
    }),
    [headerTitle, onBack, renderContent],
  );

  return isNotLessThan768 ? <GuardianEditPrompt {...props} /> : <GuardianEditPopup {...props} />;
}
