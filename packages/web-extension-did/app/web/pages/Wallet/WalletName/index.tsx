import { useCallback, useMemo } from 'react';
import WalletNamePopup from './Popup';
import { useNavigate } from 'react-router';
import { IProfileDetailDataProps, MyProfilePageType } from 'types/Profile';
import { useTranslation } from 'react-i18next';
import { useCaAddressInfoList, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

export default function WalletName() {
  const navigate = useNavigate();
  const { avatar = '', nickName = '', userId = '' } = useCurrentUserInfo();
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

  const state: IProfileDetailDataProps = useMemo(
    () => ({
      avatar,
      index: nickName?.substring(0, 1).toLocaleUpperCase(),
      addresses: transAddresses, // TODO fetch profile for chain image
      caHolderInfo: { userId, walletName: nickName },
      isShowRemark: false,
      previousPage: 'my-did',
    }),
    [avatar, nickName, transAddresses, userId],
  );

  const goBack = useCallback(() => navigate('/setting'), [navigate]);

  return <WalletNamePopup headerTitle={t('My Wallet')} data={state} type={MyProfilePageType.VIEW} goBack={goBack} />;
}
