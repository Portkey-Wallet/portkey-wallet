import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import CustomSelect from 'pages/components/CustomSelect';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import GuardianEditPrompt from './Prompt';
import GuardianEditPopup from './Popup';
import CustomModal from '../../components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import AccountShow from '../components/AccountShow';
import { guardianIconMap } from '../utils';
import './index.less';

export default function GuardiansEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGuardian, userGuardiansList, preGuardian, opGuardian } = useGuardiansInfo();
  const { verifierMap } = useGuardiansInfo();
  const [selectVal, setSelectVal] = useState<string>(opGuardian?.verifier?.id as string);
  const [exist, setExist] = useState<boolean>(false);
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item: VerifierItem) => ({
        value: item.id,
        children: (
          <div className="flex verifier-option">
            <BaseVerifierIcon fallback={item.name[0]} src={item.imageUrl} />
            <span className="title">{item.name}</span>
          </div>
        ),
      })),
    [verifierMap],
  );

  const disabled = useMemo(() => exist || selectVal === preGuardian?.verifier?.id, [exist, selectVal, preGuardian]);

  const targetVerifier = useMemo(
    () => Object.values(verifierMap ?? {})?.filter((item: VerifierItem) => item.id === selectVal),
    [selectVal, verifierMap],
  );

  const handleChange = useCallback((value: string) => {
    setExist(false);
    setSelectVal(value);
  }, []);

  const guardiansChangeHandler = useCallback(async () => {
    const existFlag: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.key === `${opGuardian?.guardianAccount}&${selectVal}`;
      }) ?? false;
    setExist(existFlag);
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
        }),
      );
      setLoading(false);
      navigate('/setting/guardians/guardian-approval', { state: 'guardians/edit' });
    } catch (error: any) {
      setLoading(false);
      console.log('---edit-guardian-error', error);
      message.error(contractErrorHandler(error));
    }
  }, [
    currentGuardian?.guardianAccount,
    dispatch,
    navigate,
    opGuardian,
    selectVal,
    setLoading,
    targetVerifier,
    userGuardianList,
    userGuardiansList,
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
    navigate('/setting/guardians/guardian-approval', { state: 'guardians/del' }); // status
  }, [opGuardian, dispatch, navigate, userGuardianList, walletInfo.caHash]);

  const checkRemove = useCallback(() => {
    if (opGuardian?.isLoginAccount) {
      CustomModal({
        type: 'info',
        content: <>{t('This guardian is login account and cannot be remove')}</>,
      });
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
  }, [opGuardian, removeHandler, t]);

  const renderContent = useMemo(
    () => (
      <div className="edit-guardian-content flex-column-between flex-1">
        <div>
          <div className="input-item">
            <div className="label">{`Guardian ${LoginType[opGuardian?.guardianType || 0]}`}</div>
            <div className="control">
              <CustomSvg type={guardianIconMap[opGuardian?.guardianType || 0]} />
              <AccountShow guardian={opGuardian} />
            </div>
          </div>
          <div className="input-item">
            <p className="label">{t('Verifier')}</p>
            <CustomSelect className="select" value={selectVal} onChange={handleChange} items={selectOptions} />
            {exist && <div className="error">{t('This guardian already exists')}</div>}
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
    [checkRemove, disabled, exist, guardiansChangeHandler, handleChange, opGuardian, selectOptions, selectVal, t],
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
