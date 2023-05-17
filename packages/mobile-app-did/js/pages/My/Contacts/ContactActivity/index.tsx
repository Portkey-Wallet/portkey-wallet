import { ChainId } from '@portkey-wallet/types';
import { addressFormat, formatChainInfoToShow } from '@portkey-wallet/utils';
import { useRoute, RouteProp } from '@react-navigation/native';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import { setStringAsync } from 'expo-clipboard';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

interface ParamsType {
  address: string;
  chainId: ChainId;
  contactName?: string;
}

const ContactActivity: React.FC = () => {
  const {
    params: { address, chainId, contactName },
  } = useRoute<RouteProp<{ params: ParamsType }>>();

  const { t } = useLanguage();

  const copyAddress = useCallback(
    async (str: string) => {
      const isCopy = await setStringAsync(str);
      isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  const navToExplore = useCallback((navAddress: string, navChainId: ChainId) => {
    navigationService.navigate('ViewOnWebView', {});
  }, []);

  return (
    <PageContainer>
      {contactName && (
        <>
          <View style={styles.itemAvatar}>
            <TextXXL>{contactName.slice(0, 1)}</TextXXL>
          </View>
          <TextL>{contactName}</TextL>
        </>
      )}

      <TextM>{addressFormat(address, chainId, 'aelf')}</TextM>
      <TextM>{formatChainInfoToShow(chainId)}</TextM>

      <View>
        <TextM>add</TextM>
        <TextM onPress={() => copyAddress(addressFormat(address, chainId, 'aelf'))}>copy</TextM>
        <TextM onPress={() => navToExplore(address, chainId)}>share</TextM>
      </View>

      <FlatList
        data={[1, 2, 3]}
        renderItem={() => <View style={{ backgroundColor: 'red', width: 500, height: 100 }} />}
      />
    </PageContainer>
  );
};

export default ContactActivity;

const styles = StyleSheet.create({
  itemAvatar: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(23),
    backgroundColor: defaultColors.bg4,
    marginRight: pTd(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
