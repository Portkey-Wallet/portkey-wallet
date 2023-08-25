import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useMemo } from 'react';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCurrentCaInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { StyleSheet, View } from 'react-native';
import ProfilePortkeyIDSection from 'pages/My/components/ProfilePortkeyIDSection';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';

import { defaultColors } from 'assets/theme';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import { FontStyles } from 'assets/theme/styles';
import { useIsShowDeletion } from 'hooks/account';

const PageHeight = windowHeight - headerHeight;

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const { walletName, userId } = useWallet();
  const caInfo = useCurrentCaInfo();
  const showDeletion = useIsShowDeletion();

  const caInfoList = useMemo(() => {
    const result: { address: string; chainId: ChainId }[] = [];
    Object.entries(caInfo || {}).map(([key, value]) => {
      const info = value as CAInfo;
      if (info?.caAddress) {
        result.push({
          address: info?.caAddress,
          chainId: key as ChainId,
        });
      }
    });
    return result;
  }, [caInfo]);

  return (
    <PageContainer titleDom={t('My DID')} safeAreaColor={['blue', 'gray']} containerStyles={pageStyles.pageWrap}>
      <View style={pageStyles.pageContainer}>
        <View>
          <ProfileHeaderSection name={walletName} />
          <ProfilePortkeyIDSection portkeyID={userId || ''} />
          <ProfileAddressSection addressList={caInfoList} />
        </View>
        <CommonButton title="Edit" type="solid" onPress={() => navigationService.navigate('EditWalletName')} />
      </View>
      {showDeletion && (
        <CommonButton
          title="Delete Account"
          type="clear"
          titleStyle={FontStyles.font7}
          onPress={() => navigationService.navigate('AccountCancelation')}
        />
      )}
    </PageContainer>
  );
};
export default WalletName;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
  },
  pageContainer: {
    paddingTop: 24,
    paddingBottom: 78,
    height: PageHeight,
    justifyContent: 'space-between',
  },
});
