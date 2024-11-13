import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useMemo, useRef, useState } from 'react';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { View, StyleSheet } from 'react-native';
import { useCurrentCaInfo, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection, { ProfileAddressSectionV2 } from 'pages/My/components/ProfileAddressSection';
import { useIsShowDeletion } from '@portkey-wallet/hooks/hooks-ca/account';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import { FontStyles } from 'assets/theme/styles';
import { Button, Text } from 'react-native';
import { darkColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import { makeStyles } from '@rneui/themed';
import { isIOS } from '@rneui/base';
import { pTd } from 'utils/unit';
import { TextXXXL } from 'components/CommonText';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';
import FastImage from 'components/FastImage';
import ChangeOverlay from './components/ChangePictureOverlay';

const MyWallet: React.FC = () => {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const caInfo = useCurrentCaInfo();
  const pageStyles = getStyles();
  const showDeletion = useIsShowDeletion();
  const [avatar, setAvatar] = useState<string>(userInfo?.avatar || '');

  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);

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

  const handleSelectPhoto = async () => {
    try {
      const res = await uploadRef.current?.selectPhotoWithSource();
      console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <PageContainer
      titleDom={t('My Wallet')}
      safeAreaColor={['black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.userInfoWrap}>
        <View style={pageStyles.avatarWrap}>
          <Touchable
            style={{}}
            onPress={async () => {
              // ChangeOverlay.showModal({
              //   title: t('Change wallet picture'),
              //   avatar: avatar,
              //   selectPhoto: handleSelectPhoto,
              // });
            }}>
            <View
              style={{
                width: pTd(80),
                height: pTd(80),
              }}>
              <FastImage
                style={{
                  width: pTd(80),
                  height: pTd(80),
                  borderRadius: pTd(80) / 2,
                  marginHorizontal: pTd(8),
                }}
                resizeMode="cover"
                source={{
                  uri: avatar,
                }}
              />

              {/* <View style={{ display: 'none' }}>
                <ImageWithUploadFunc
                  avatarSize={pTd(80)}
                  ref={uploadRef}
                  title={userInfo?.nickName || ''}
                  // imageUrl={avatar || ''}
                />
              </View> */}

              <View style={pageStyles.editIcon}>
                <Svg
                  iconStyle={{
                    width: pTd(20),
                    height: pTd(20),
                  }}
                  icon="edit_thin"
                  size={pTd(20)}
                />
              </View>
            </View>
          </Touchable>
        </View>
        <TextXXXL style={pageStyles.nicknameText}>{userInfo.nickName}</TextXXXL>
      </View>
      <ProfileAddressSectionV2 title={'My addresses'} isMySelf addressList={caInfoList} />
      <View style={pageStyles.flex} />
      <View style={pageStyles.deleteWalletWrap}>
        <Text onPress={() => navigationService.navigate('AccountCancelation')} style={pageStyles.deleteWalletText}>
          Delete wallet
        </Text>
      </View>
    </PageContainer>
  );
};
export default MyWallet;

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  userInfoWrap: {
    marginTop: pTd(24),
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  nicknameText: {
    marginTop: pTd(12),
    color: theme.colors.textBase1,
    textAlign: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: pTd(0),
    bottom: pTd(0),
    zIndex: 1,
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
    borderColor: '#414142',
    borderWidth: pTd(1),
    backgroundColor: theme.colors.bgBase2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setButton: {
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
  deleteWalletWrap: {
    height: pTd(48),
    alignContent: 'center',
    justifyContent: 'center',
  },
  deleteWalletText: {
    color: theme.colors.textBase3,
    height: pTd(16),
    fontSize: 16,
    textAlign: 'center',
  },
}));
