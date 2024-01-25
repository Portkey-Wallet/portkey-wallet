import { useCallback, useMemo, useState } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import WalletNamePopup from './Popup';
import WalletNamePrompt from './Prompt';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { IProfileDetailDataProps, MyProfilePageType } from 'types/Profile';
import { useTranslation } from 'react-i18next';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useLocationState } from 'hooks/router';
import { FromPageEnum, TWalletNameLocationState } from 'types/router';

export default function WalletName() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const { state: locationState } = useLocationState<TWalletNameLocationState>();
  const showChat = useIsChatShow();
  const { userInfo } = useWalletInfo();
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
  const title = useMemo(() => (showChat ? t('My Wallet') : t('My Profile')), [showChat, t]);
  const [headerTitle, setHeaderTitle] = useState(title);

  const state: IProfileDetailDataProps = useMemo(
    () => ({
      avatar: userInfo?.avatar,
      index: userInfo?.nickName.substring(0, 1).toLocaleUpperCase(),
      addresses: transAddresses, // TODO fetch profile for chain image
      caHolderInfo: { userId: userInfo?.userId, walletName: userInfo?.nickName },
      isShowRemark: false,
      previousPage: 'my-did',
    }),
    [transAddresses, userInfo?.avatar, userInfo?.nickName, userInfo?.userId],
  );

  const showEdit = useCallback(() => {
    setHeaderTitle(editText);
    setType(MyProfilePageType.EDIT);
  }, [editText]);

  const showView = useCallback(() => {
    if (type === MyProfilePageType.VIEW) {
      if (locationState?.previousPage === FromPageEnum.chatGroupInfo)
        return navigate(`/chat-group-info/${locationState?.channelUuid}`);

      if (locationState?.previousPage === FromPageEnum.chatMemberList)
        return navigate(`/chat-group-info/${locationState?.channelUuid}/member-list`, { state: locationState });

      if (
        locationState?.previousPage &&
        [FromPageEnum.chatBox, FromPageEnum.chatBoxGroup].includes(locationState?.previousPage)
      )
        return navigate(`/${locationState.previousPage}/${locationState?.channelUuid}`);
      return navigate('/setting/wallet');
    }
    if (type === MyProfilePageType.EDIT) {
      setHeaderTitle(title);
      setType(MyProfilePageType.VIEW);
    }
  }, [locationState, navigate, title, type]);

  // const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);
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
      saveCallback={saveCallback}
    />
  ) : (
    <WalletNamePopup
      headerTitle={headerTitle}
      data={state}
      type={type}
      editText={editText}
      goBack={showView}
      handleEdit={showEdit}
      saveCallback={saveCallback}
    />
  );
}
