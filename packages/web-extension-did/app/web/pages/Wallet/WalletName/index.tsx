import { useCallback, useMemo, useState } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import WalletNamePopup from './Popup';
import WalletNamePrompt from './Prompt';
import { useLocation, useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { IProfileDetailDataProps, MyProfilePageType } from 'types/Profile';
import { useProfileCopy } from 'hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

export default function WalletName() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const showChat = useIsChatShow();
  const { walletName, userId } = useWalletInfo();
  const caAddressInfos = useCaAddressInfoList();
  const transAddresses = useMemo(() => {
    return caAddressInfos.map((item) => {
      return {
        chainName: 'aelf',
        chainId: item.chainId,
        address: item.caAddress,
      };
    });
  }, [caAddressInfos]);

  const { t } = useTranslation();
  const editText = t('Edit');
  const [type, setType] = useState<MyProfilePageType>(MyProfilePageType.VIEW);
  const title = useMemo(() => (showChat ? t('My Wallet') : 'Wallet Name'), [showChat, t]);
  const [headerTitle, setHeaderTitle] = useState(title);

  const state: IProfileDetailDataProps = useMemo(
    () => ({
      index: walletName.substring(0, 1).toLocaleUpperCase(),
      addresses: transAddresses, // TODO fetch profile for chain image
      caHolderInfo: { userId: userId, walletName: walletName },
      isShowRemark: false,
      from: 'my-did',
    }),
    [transAddresses, userId, walletName],
  );

  const showEdit = useCallback(() => {
    setHeaderTitle(editText);
    setType(MyProfilePageType.EDIT);
  }, [editText]);

  const showView = useCallback(() => {
    if (type === MyProfilePageType.VIEW) {
      if (locationState?.from === 'chat-group-info') {
        navigate(`/chat-group-info/${locationState?.channelUuid}`);
      } else if (locationState?.from === 'chat-member-list') {
        navigate(`/chat-group-info/${locationState?.channelUuid}/member-list`, { state: locationState });
      } else {
        navigate('/setting/wallet');
      }
    }
    if (type === MyProfilePageType.EDIT) {
      setHeaderTitle(title);
      setType(MyProfilePageType.VIEW);
    }
  }, [locationState, navigate, title, type]);

  const handleCopy = useProfileCopy();
  // const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);
  const saveCallback = useCallback(() => {
    setType(MyProfilePageType.VIEW);
  }, []);

  return isNotLessThan768 ? (
    <WalletNamePrompt
      headerTitle={headerTitle}
      data={state}
      showChat={showChat}
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
      showChat={showChat}
      type={type}
      editText={editText}
      goBack={showView}
      handleEdit={showEdit}
      handleCopy={handleCopy}
      saveCallback={saveCallback}
    />
  );
}
