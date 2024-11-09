import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import Touchable from 'components/Touchable';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import fonts from 'assets/theme/fonts';
import * as Clipboard from 'expo-clipboard';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { makeStyles, useTheme } from '@rneui/themed';
import { TextL } from 'components/CommonText';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import ContactAddress, { IContactAddressRef } from 'components/ContactAddress';

type RouterParams = {
  contact?: IContactItemType;
};

const NoChatContactProfile: React.FC = () => {
  const { contact } = useRouterParams<RouterParams>();
  const contactAddressRef = useRef<IContactAddressRef>(null);
  const [isViewMoreDropdown, setIsViewMoreDropdown] = useState(false);
  const { t } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const pageStyles = getPageStyles();

  const hadleCopy = useCallback(async () => {
    const addressFormatStr = contactAddressRef.current?.getAddress();
    if (!addressFormatStr) return;
    const isCopy = await Clipboard.setStringAsync(addressFormatStr);
    isCopy && CommonToast.success(t('Copy Success'));
  }, [t]);

  return (
    <PageContainer
      titleDom="Address Details"
      safeAreaColor={['black', 'black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        <Touchable
          style={{ paddingRight: pTd(16) }}
          onPress={() => {
            setIsViewMoreDropdown(!isViewMoreDropdown);
          }}>
          <Svg icon="more-vertical" size={pTd(24)} color={colors.textBase1} />
        </Touchable>
      }>
      <ScrollView alwaysBounceVertical={true}>
        <ProfileHeaderSection
          showRemark={false}
          name={(contact?.name || contact?.caHolderInfo?.walletName)?.toUpperCase() || ''}
          avatarUrl={contact?.caHolderInfo?.avatar || ''}
          style={pageStyles.profileHeader}
          nameStyle={pageStyles.profileHeaderName}
        />
        <View style={pageStyles.profileAddress}>
          <TextL>Address</TextL>
          <View style={pageStyles.addressWrap}>
            {contact?.addressInfo?.networkImage && (
              <Image source={{ uri: contact.addressInfo.networkImage }} style={pageStyles.avatarNetworkIcon} />
            )}
            <View style={GStyles.flex1}>
              <TextL style={pageStyles.addressNetworkName}>{contact?.addressInfo?.networkName}</TextL>
              {contact && <ContactAddress ref={contactAddressRef} contact={contact} style={pageStyles.address} />}
            </View>
            <Touchable style={pageStyles.addressCopy} onPress={hadleCopy}>
              <Svg icon="copy" size={pTd(24)} color={colors.iconBase3} />
            </Touchable>
          </View>
        </View>
      </ScrollView>
      {isViewMoreDropdown && (
        <View style={pageStyles.dropDownWrap}>
          <Touchable
            style={pageStyles.dropDownItem}
            onPress={() => {
              navigationService.navigate('NoChatContactProfileEdit', { contact });
            }}>
            <Svg icon="edit1" size={pTd(24)} color={colors.textBase1} />
            <TextL style={pageStyles.dropDownItemText}>Edit address</TextL>
          </Touchable>
          <Touchable style={pageStyles.dropDownItem}>
            <Svg icon="external" size={pTd(24)} color={colors.textBase1} />
            <TextL style={pageStyles.dropDownItemText}>View on explorer</TextL>
          </Touchable>
        </View>
      )}
    </PageContainer>
  );
};

export default NoChatContactProfile;

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
  },
  dropDownWrap: {
    position: 'absolute',
    right: pTd(8),
    top: pTd(12),
    borderColor: theme.colors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(8),
    paddingVertical: pTd(8),
    backgroundColor: theme.colors.bgBase1,
  },
  dropDownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(48),
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(12),
  },
  dropDownItemText: {
    marginLeft: pTd(12),
    lineHeight: pTd(22),
  },
  profileHeader: {
    marginTop: pTd(32),
  },
  profileHeaderName: {
    marginTop: pTd(12),
    fontSize: pTd(20),
    lineHeight: pTd(24),
    color: theme.colors.textBase1,
    ...fonts.BGMediumFont,
  },
  profileAddress: {
    marginTop: pTd(32),
  },
  addressWrap: {
    marginTop: pTd(8),
    borderColor: theme.colors.bgBase2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...GStyles.paddingArg(12, 16),
  },
  avatarNetworkIcon: {
    width: pTd(24),
    height: pTd(24),
    marginRight: pTd(12),
  },
  addressNetworkName: {
    marginBottom: pTd(5),
    lineHeight: pTd(22),
  },
  address: {
    fontSize: pTd(14),
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
  },
  addressCopy: {
    width: pTd(24),
    height: pTd(24),
  },
}));
