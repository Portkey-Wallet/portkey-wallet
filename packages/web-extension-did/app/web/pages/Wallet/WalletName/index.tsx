import { useCallback, useMemo, useState } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import WalletNamePopup from './Popup';
import WalletNamePrompt from './Prompt';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { IProfileDetailDataProps, MyProfilePageType } from 'types/Profile';
import { useProfileCopy } from 'hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';

export default function WalletName() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const { walletName, userId } = useWalletInfo();
  const caAddressInfos = useCaAddressInfoList();
  const transAddresses = useMemo(() => {
    return caAddressInfos.map((item) => {
      return { chainName: item.chainName, chainId: item.chainId, address: item.caAddress };
    });
  }, [caAddressInfos]);

  const { t } = useTranslation();
  const editText = t('Edit');
  const [type, setType] = useState<MyProfilePageType>(MyProfilePageType.VIEW);
  const title = useMemo(() => (isMainnet ? t('My DID') : walletName), [isMainnet, t, walletName]);
  const [headerTitle, setHeaderTitle] = useState(title);

  const state: IProfileDetailDataProps = useMemo(
    () => ({
      index: walletName.substring(0, 1).toLocaleUpperCase(),
      walletName: walletName,
      addresses: transAddresses,
      userId: userId,
      isShowRemark: false,
    }),
    [transAddresses, userId, walletName],
  );

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

  const handleCopy = useProfileCopy();
  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);
  const saveCallback = useCallback(() => {
    setType(MyProfilePageType.VIEW);
  }, []);

  return isNotLessThan768 ? (
    <WalletNamePrompt
      headerTitle={headerTitle}
      data={state}
      type={type}
      editText={editText}
      goBack={showView}
      handleEdit={showEdit}
      handleCopy={handleCopy}
      saveCallback={saveCallback}
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
      saveCallback={saveCallback}
    />
  );
}
