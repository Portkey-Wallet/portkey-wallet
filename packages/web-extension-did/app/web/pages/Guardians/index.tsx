import { useCallback, useEffect, useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import useGuardianList from 'hooks/useGuardianList';
import { useAppDispatch, useCommonState, useGuardiansInfo } from 'store/Provider/hooks';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { setCurrentGuardianAction, setOpGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import VerifierPair from 'components/VerifierPair';
import { Button } from 'antd';
import useVerifierList from 'hooks/useVerifierList';
import GuardiansPopup from './Popup';
import GuardiansPrompt from './Prompt';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import AccountShow from './components/AccountShow';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TAddGuardianLocationState, TGuardiansLocationState } from 'types/router';
import './index.less';

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

  const renderGuardianList = useMemo(
    () => (
      <ul>
        {formatGuardianList.map((item, key) => (
          <li
            key={key}
            onClick={() => {
              dispatch(setCurrentGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
              dispatch(setOpGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
              isPrompt
                ? navigate('/setting/guardians/view')
                : InternalMessage.payload(PortkeyMessageTypes.GUARDIANS_VIEW).send();
            }}>
            <div className="flex-between-center guardian">
              <div className="guardian-item-wrap">
                {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
                <div className="flex-start-center">
                  <VerifierPair
                    guardian={item}
                    guardianType={item.guardianType}
                    verifierSrc={item.verifier?.imageUrl}
                    verifierName={item?.verifier?.name}
                  />
                  <AccountShow guardian={item} />
                </div>
              </div>
              <div>
                <CustomSvg type="Right" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    ),
    [dispatch, formatGuardianList, isPrompt, navigate, t],
  );

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

  return isNotLessThan768 ? (
    <GuardiansPrompt {...props} />
  ) : (
    <GuardiansPopup {...props} showAddBtn={true} onAdd={onAdd} onBack={onBack} />
  );
}
