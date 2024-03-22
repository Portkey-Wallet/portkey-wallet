import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { pageStyles } from './style';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import { pTd } from 'utils/unit';
import { AddressItem, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { TextM, TextS, TextXXL } from '@portkey-wallet/rn-components/components/CommonText';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { useCurrentNetworkType } from 'model/hooks/network';
import { formatChainInfoToShow } from '@portkey-wallet/utils';

type RouterParams = {
  contact?: ContactItemType;
};

const ContactDetail: React.FC = ({ contact }: RouterParams) => {
  const { t } = useLanguage();
  const currentNetwork = useCurrentNetworkType();

  const renderAddress = useCallback(
    (addressItem: AddressItem, index: number) => (
      <View key={index} style={pageStyles.addressWrap}>
        <View style={pageStyles.addressInfo}>
          <TextM style={pageStyles.addressLabel}>
            ELF_{addressItem.address}_{addressItem.chainId}
          </TextM>
          <TextS style={FontStyles.font3}>{formatChainInfoToShow(addressItem.chainId, currentNetwork)}</TextS>
        </View>
        <Touchable
          style={GStyles.marginTop(12)}
          onPress={async () => {
            if (!addressItem.address) return;
            const isCopy = await setStringAsync(`ELF_${addressItem.address}_${addressItem.chainId}`);
            isCopy && CommonToast.success(t('Copied'));
          }}>
          <CommonSvg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>
    ),
    [currentNetwork, t],
  );

  return (
    <PageContainer
      titleDom={'Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={[FontStyles.font3, pageStyles.titleWrap]}>{t('Name')}</TextM>
      <View style={pageStyles.contactInfo}>
        <View style={pageStyles.contactAvatar}>
          <TextXXL style={FontStyles.font5}>{contact?.index}</TextXXL>
        </View>
        <Text style={FontStyles.font5}>{contact?.name}</Text>
      </View>
      <TextM style={[FontStyles.font3, pageStyles.titleWrap]}>{t('Address')}</TextM>

      <ScrollView alwaysBounceVertical={true}>
        <TouchableWithoutFeedback>
          <View>{contact?.addresses.map((addressItem, addressIdx) => renderAddress(addressItem, addressIdx))}</View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <CommonButton
        type="primary"
        containerStyle={GStyles.paddingTop(16)}
        onPress={() => {
          // navigate to ContactEdit
        }}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default ContactDetail;
