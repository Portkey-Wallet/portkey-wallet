import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import WalletNamePopup from './Popup';
import WalletNamePrompt from './Prompt';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { IProfileDetailDataProps, MyProfilePageType } from 'types/Profile';
import { useProfileCopy } from 'hooks/useProfile';
import { useTranslation } from 'react-i18next';

export default function WalletName() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const { walletName } = useWalletInfo();
  const { t } = useTranslation();
  const editText = t('Edit');
  const [type, setType] = useState<MyProfilePageType>(MyProfilePageType.VIEW);
  const title = useMemo(() => (isMainnet ? t('My DID') : walletName), [isMainnet, t, walletName]);
  const [headerTitle, setHeaderTitle] = useState(title);

  const showEdit = useCallback(() => {
    setHeaderTitle(editText);
    setType(MyProfilePageType.EDIT);
  }, [editText]);

  const showView = useCallback(() => {
    if (type === MyProfilePageType.VIEW) {
      navigate('/setting/wallet');
    }
    if (type === MyProfilePageType.EDIT) {
      setHeaderTitle(title);
      setType(MyProfilePageType.VIEW);
    }
  }, [navigate, title, type]);

  // TODO fetch profile
  const state: IProfileDetailDataProps = {
    index: 'B',
    name: walletName,
    addresses: [{ chainId: 'AELF', address: 'H8CXvfy8hm', chainName: 'aelf' }],
    portkeyId: '111111',
    relationId: '111',
    isNameDisable: false,
    isShowRemark: false,
  };

  const handleCopy = useProfileCopy();
  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);

  return isNotLessThan768 ? (
    <WalletNamePrompt
      headerTitle={headerTitle}
      data={state}
      type={type}
      editText={editText}
      goBack={showView}
      handleEdit={showEdit}
      handleCopy={handleCopy}
    />
  ) : (
    <WalletNamePopup
      headerTitle={headerTitle}
      data={state}
      type={type}
      editText={editText}
      goBack={goBack}
      handleEdit={showView}
      handleCopy={handleCopy}
    />
  );
}
