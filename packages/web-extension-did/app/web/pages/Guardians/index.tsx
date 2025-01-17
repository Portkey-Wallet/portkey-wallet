import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useGuardianList from 'hooks/useGuardianList';
import { useAppDispatch, useCommonState, useGuardiansInfo } from 'store/Provider/hooks';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { setCurrentGuardianAction, setOpGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import VerifierPair from 'components/VerifierPair';
import { Button } from 'antd';
import useVerifierList from 'hooks/useVerifierList';
import GuardiansPopup from './Popup';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import AccountShow from './components/AccountShow';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TAddGuardianLocationState, TGuardiansLocationState } from 'types/router';
import './index.less';
import MenuItem from '../../components/MenuItem';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';

export default function Guardians() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<TGuardiansLocationState>();
  const navigate = useNavigateState<TAddGuardianLocationState>();
  const { userGuardiansList } = useGuardiansInfo();
  const { walletInfo } = useCurrentWallet();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const getGuardianList = useGuardianList();
  const originChainId = useOriginChainId();
  const accelerateChainId = useMemo(
    () => state?.accelerateChainId || originChainId,
    [originChainId, state?.accelerateChainId],
  );
  useVerifierList();

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, isNotLessThan768, walletInfo]);

  const formatGuardianList = useMemo(() => {
    const temp = [...(userGuardiansList || [])];
    temp.reverse();
    return temp;
  }, [userGuardiansList]);

  const onBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  const onAdd = useCallback(() => {
    isPrompt
      ? navigate('/setting/guardians/add', { state: { accelerateChainId } })
      : InternalMessage.payload(PortkeyMessageTypes.ADD_GUARDIANS, JSON.stringify({ accelerateChainId })).send();
  }, [isPrompt, navigate, accelerateChainId]);

  const headerTitle = useMemo(() => 'Guardians', []);

  const renderGuardianList = useMemo(() => {
    const _renderGuardianList = (guardianList: UserGuardianItem[]) =>
      guardianList.map((item, key) => (
        <MenuItem
          key={key}
          height={74}
          onClick={() => {
            dispatch(setCurrentGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
            dispatch(setOpGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
            isPrompt
              ? navigate('/setting/guardians/view')
              : InternalMessage.payload(PortkeyMessageTypes.GUARDIANS_VIEW).send();
          }}>
          <div className="flex-start-center guardian">
            <VerifierPair
              guardian={item}
              guardianType={item.guardianType}
              verifierSrc={item.verifier?.imageUrl}
              verifierName={item?.verifier?.name}
            />
            <AccountShow guardian={item} />
          </div>
        </MenuItem>
      ));
    const loginGuardians = formatGuardianList.filter((item) => item.isLoginAccount);
    const othersGuardians = formatGuardianList.filter((item) => !item.isLoginAccount);
    return (
      <div className="guardian">
        {loginGuardians.length > 0 && (
          <div>
            <div className="guardian-title">{t('Login account(s)')}</div>
            {_renderGuardianList(loginGuardians)}
          </div>
        )}
        {othersGuardians.length > 0 && (
          <div>
            <div className="guardian-title">{t('Other guardian(s)')}</div>
            {_renderGuardianList(othersGuardians)}
          </div>
        )}
        <a
          className="learn-more"
          href="https://doc.portkey.finance/docs/What-are-guardians-and-verifiers"
          target="_blank"
          rel="noreferrer">
          Learn more about account guardians
        </a>
      </div>
    );
  }, [dispatch, formatGuardianList, isPrompt, navigate, t]);

  const renderAddBtn = useMemo(() => {
    return (
      <Button onClick={onAdd} className="guardian-add-btn">
        Add Guardians
      </Button>
    );
  }, [onAdd]);

  const props = useMemo(
    () => ({
      headerTitle,
      renderAddBtn,
      renderGuardianList,
    }),
    [headerTitle, renderAddBtn, renderGuardianList],
  );

  return <GuardiansPopup {...props} showAddBtn={true} onAdd={onAdd} onBack={onBack} />;
}
