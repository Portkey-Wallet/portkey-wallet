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

import { isIOS } from '@rneui/base';
import { pTd } from 'utils/unit';
import { TextXXXL } from 'components/CommonText';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';
import FastImage from 'components/FastImage';
import ChangeOverlay from './components/ChangePictureOverlay';
const PageHeight = windowHeight - headerHeight;

const MyWallet: React.FC = () => {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const caInfo = useCurrentCaInfo();
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
    <PageContainer titleDom={t('My Wallet')} safeAreaColor={['white', 'gray']} containerStyles={pageStyles.pageWrap}>
      <View style={pageStyles.pageContainer}>
        <View>
          <View
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Touchable
                style={[
                  GStyles.center,
                  {
                    position: 'relative',
                  },
                ]}
                onPress={async () => {
                  ChangeOverlay.showModal({
                    title: t('Change wallet picture'),
                    avatar: avatar,
                    selectPhoto: handleSelectPhoto,
                  });
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

                  <View style={{ display: 'none' }}>
                    <ImageWithUploadFunc
                      avatarSize={pTd(80)}
                      ref={uploadRef}
                      title={userInfo?.nickName || ''}
                      // imageUrl={avatar || ''}
                    />
                  </View>

                  <View
                    style={{
                      position: 'absolute',
                      right: pTd(0),
                      bottom: pTd(0),
                      zIndex: 1,
                      width: pTd(32),
                      height: pTd(32),
                      borderRadius: pTd(16),
                      borderColor: '#414142',
                      borderWidth: pTd(1),
                      backgroundColor: defaultColors.black,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
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
            <TextXXXL
              style={[
                {
                  color: defaultColors.white,
                  textAlign: 'center',
                },
                GStyles.marginTop(pTd(12)),
              ]}>
              rach***@gmail.com
            </TextXXXL>
          </View>
          <ProfileAddressSectionV2 title={'My address'} isMySelf addressList={caInfoList} />
        </View>
        <View
          style={{
            height: pTd(48),
            backgroundColor: defaultColors.black,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text
            onPress={() => navigationService.navigate('AccountCancelation')}
            style={{
              color: darkColors.textBase2,
              height: pTd(16),
              fontSize: 16,
              textAlign: 'center',
            }}>
            Delete Account
          </Text>
        </View>
      </View>

      <CommonButton
        title="Delete Account"
        type="clear"
        titleStyle={FontStyles.font7}
        onPress={() => navigationService.navigate('AccountCancelation')}
      />
      <View
        style={{
          height: pTd(48),
          backgroundColor: defaultColors.black,
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: darkColors.textBase2,
          }}>
          Delete Account
        </Text>
      </View>
    </PageContainer>
  );
};
export default MyWallet;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.black,
  },
  pageContainer: {
    paddingTop: 24,
    paddingBottom: isIOS ? 40 : 20,
    height: PageHeight,
    justifyContent: 'space-between',
  },
  setButton: {
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
});
