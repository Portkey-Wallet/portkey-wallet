import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import Touchable from 'components/Touchable';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import fonts from 'assets/theme/fonts';
import * as Clipboard from 'expo-clipboard';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getExploreLink } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { makeStyles, useTheme } from '@rneui/themed';
import { TextL } from 'components/CommonText';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import ContactAddress, { IContactAddressRef } from 'components/ContactAddress';
import { AELF_NETWORK_NAME } from 'constants/common';
import AddressActivity from '../AddressActivity';
import { RouteProp, useRoute } from '@react-navigation/native';

type RouterParams = {
  contact?: IContactItemType;
  isSaved?: boolean;
  from?: string;
};

const NoChatContactProfile: React.FC = () => {
  const {
    params: { contact, isSaved = true, from },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
  const contactAddressRef = useRef<IContactAddressRef>(null);
  const [isViewMoreDropdown, setIsViewMoreDropdown] = useState(false);
  const { t } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const pageStyles = getPageStyles();

  const handleCopy = useCallback(async () => {
    const addressFormatStr = contactAddressRef.current?.getAddress();
    if (!addressFormatStr) {
      return;
    }
    const isCopy = await Clipboard.setStringAsync(addressFormatStr);
    isCopy && CommonToast.success(t('Copy Success'));
  }, [t]);
  const handleAddContact = useCallback(() => {
    navigationService.navigate('NoChatContactProfileEdit', { willAddContact: contact, from });
  }, [contact, from]);
  const isAelfNetwork = useMemo(() => {
    const { network } = contact?.addressInfo ?? {};
    return network === AELF_NETWORK_NAME;
  }, [contact]);
  const hideDropDown = useCallback(() => {
    setIsViewMoreDropdown(false);
  }, []);

  const activityParams = useMemo(() => {
    return {
      address: contact?.addressInfo?.address,
      chainId: contact?.addressInfo?.chainId,
    };
  }, [contact]);

  const { explorerUrl } = useCurrentChain(contact?.addressInfo?.chainId) ?? {};

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
      <TouchableWithoutFeedback
        onPress={() => {
          hideDropDown();
        }}>
        <View style={GStyles.flex1}>
          {isSaved && (
            <ProfileHeaderSection
              showRemark={false}
              name={contact?.name || contact?.caHolderInfo?.walletName || ''}
              avatarUrl={contact?.caHolderInfo?.avatar || ''}
              style={pageStyles.profileHeader}
              nameStyle={pageStyles.profileHeaderName}
            />
          )}
          <View style={pageStyles.profileAddress}>
            <TextL>Address</TextL>
            <View style={pageStyles.addressWrap}>
              {contact?.addressInfo?.networkImage && (
                <Image source={{ uri: contact.addressInfo.networkImage }} style={pageStyles.avatarNetworkIcon} />
              )}
              <View style={GStyles.flex1}>
                <TextL style={pageStyles.addressNetworkName}>{contact?.addressInfo?.networkName}</TextL>
                {contact && (
                  <ContactAddress
                    ref={contactAddressRef}
                    contact={contact}
                    style={pageStyles.address}
                    ignoreFormat={!isSaved}
                  />
                )}
              </View>
              {isSaved ? (
                <Touchable
                  style={pageStyles.addressCopy}
                  onPress={() => {
                    handleCopy();
                    hideDropDown();
                  }}>
                  <Svg icon="copy" size={pTd(24)} color={colors.iconBase3} />
                </Touchable>
              ) : (
                <Touchable style={pageStyles.addressCopy} onPress={handleAddContact}>
                  <Svg icon="add-contact1" size={pTd(24)} color={colors.iconBase3} />
                </Touchable>
              )}
            </View>
          </View>
          {isSaved &&
            (isAelfNetwork ? (
              activityParams?.address &&
              activityParams?.chainId && (
                <AddressActivity
                  address={activityParams?.address}
                  chainId={activityParams?.chainId}
                  onItemPress={hideDropDown}
                />
              )
            ) : (
              <TextL style={pageStyles.emptyActivity}>Interactions not available</TextL>
            ))}
        </View>
      </TouchableWithoutFeedback>
      {isViewMoreDropdown && (
        <View style={pageStyles.dropDownWrap}>
          {isSaved ? (
            <Touchable
              style={pageStyles.dropDownItem}
              onPress={() => {
                navigationService.navigate('NoChatContactProfileEdit', { contact, from });
                setIsViewMoreDropdown(false);
              }}>
              <Svg icon="edit1" size={pTd(24)} color={colors.textBase1} />
              <TextL style={pageStyles.dropDownItemText}>Edit address</TextL>
            </Touchable>
          ) : (
            <Touchable
              style={pageStyles.dropDownItem}
              onPress={() => {
                handleCopy();
                setIsViewMoreDropdown(false);
              }}>
              <Svg icon="copy" size={pTd(24)} color={colors.iconBase1} />
              <TextL style={pageStyles.dropDownItemText}>Copy address</TextL>
            </Touchable>
          )}
          {isAelfNetwork && explorerUrl && (
            <Touchable
              style={pageStyles.dropDownItem}
              onPress={() => {
                navigationService.navigate('ViewOnWebView', {
                  title: t('View on Explorer'),
                  url: getExploreLink(explorerUrl, contact?.addressInfo?.address || '', 'address'),
                });
                setIsViewMoreDropdown(false);
              }}>
              <Svg icon="external" size={pTd(24)} color={colors.textBase1} />
              <TextL style={pageStyles.dropDownItemText}>View on explorer</TextL>
            </Touchable>
          )}
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
    marginTop: pTd(16),
    marginBottom: pTd(32),
  },
  profileHeaderName: {
    marginTop: pTd(12),
    fontSize: pTd(20),
    lineHeight: pTd(24),
    color: theme.colors.textBase1,
    ...fonts.BGMediumFont,
  },
  profileAddress: {},
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
  emptyActivity: {
    textAlign: 'center',
    color: theme.colors.textBase2,
    paddingTop: pTd(32),
  },
}));
