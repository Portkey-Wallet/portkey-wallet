import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import navigationService from 'utils/navigationService';
import { View } from 'react-native';
import { useCurrentCaInfo, useCurrentUserInfo, useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { ProfileAddressSectionV2 } from 'pages/My/components/ProfileAddressSection';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';

import { Text } from 'react-native';
import { darkColors } from 'assets/theme';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { TextXXXL } from 'components/CommonText';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';
import ChangeOverlay from './components/ChangePictureOverlay';
import RenameOverlay from './components/RenameOverlay';
import { sleep } from '@portkey-wallet/utils';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { LoadingBody } from 'components/Loading';
import CommonAvatar from 'components/CommonAvatar';
import fonts from 'assets/theme/fonts';

const MyWallet: React.FC = () => {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const caInfo = useCurrentCaInfo();
  const pageStyles = getStyles();
  const [avatar, setAvatar] = useState<string>(userInfo?.avatar || '');
  const setUserInfo = useSetUserInfo();
  const [avatarList, setAvatarList] = useState<Array<string>>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);
  const networkInfo = useCurrentNetworkInfo();

  const fetchIconList = async () => {
    console.log('=============Fetching');

    try {
      const iconList = await request.wallet.getIconList({
        baseURL: networkInfo.apiUrl,
      });

      setAvatarList(iconList.defaultAvatars);

      console.log('=============iconList:', iconList);
    } catch (error) {
      console.log('=============iconList:', error);
    }
  };

  useEffect(() => {
    fetchIconList();
  }, []);

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

  const handlePhotoUpload = async () => {
    try {
      const selectPhotoRes = await uploadRef.current?.selectPhoto();
      console.log('selectPhotoRes: ', selectPhotoRes);
      const s3Url = await uploadRef.current?.uploadPhoto();
      if (s3Url) {
        setAvatar(s3Url);
        await setUserInfo({ avatar: s3Url });
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleSelectPhoto = async (url: string) => {
    // Loading.show();
    console.log('url:', url);
    setAvatar(url);
    console.log('setAvatar:', url);

    try {
      setIsLoading(true);
      await sleep(500); // adjust large size on android
      const res = await setUserInfo({ avatar: url });
      console.log('res:', res);

      navigationService.goBack();
      // CommonToast.success(t('Saved Successful'));
    } catch (error: any) {
      console.log('setUserInfo: error', error);
      // CommonToast.failError(error);
    } finally {
      // Loading.hide();
      setIsLoading(false);
    }
  };

  const handleRename = async (name: string) => {
    console.log('handleRename:', name);
    const res = await setUserInfo({ nickName: name });
    console.log(res);
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
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              ChangeOverlay.showModal({
                title: t('Change wallet picture'),
                avatar: avatar,
                nickName: userInfo.nickName,
                avatarList: avatarList || [],
                photoUpload: handlePhotoUpload,
                selectPhoto: handleSelectPhoto,
              });
            }}>
            <View
              style={{
                width: pTd(80),
                height: pTd(80),
              }}>
              <View
                style={{
                  marginHorizontal: pTd(8),
                  position: 'relative',
                }}>
                <CommonAvatar
                  resizeMode="cover"
                  avatarSize={pTd(80)}
                  imageUrl={avatar || ''}
                  title={userInfo.nickName}
                />

                {/* <FastImage
                  style={{
                    width: pTd(80),
                    height: pTd(80),
                    borderRadius: pTd(80) / 2,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: avatar,
                  }}
                /> */}

                {isLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      width: pTd(80),
                      height: pTd(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: pTd(80) / 2,
                      backgroundColor: '#000000B2',
                    }}>
                    <View
                      style={{
                        top: 8,
                      }}>
                      <LoadingBody position={'center'} iconType={'loading'} />
                    </View>
                  </View>
                )}
              </View>

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
        <View
          style={{
            marginTop: pTd(12),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TextXXXL style={[pageStyles.nicknameText, fonts.BGMediumFont]}>{userInfo.nickName}</TextXXXL>
          <Touchable
            onPress={() => {
              RenameOverlay.showModal({
                title: t('Rename wallet'),
                nickName: userInfo.nickName,
                onChange: handleRename,
              });
            }}>
            <Svg icon="edit_thin" size={pTd(20)} />
          </Touchable>
        </View>
      </View>
      <ProfileAddressSectionV2 title={'My addresses'} isMySelf addressList={caInfoList} />
      <View style={pageStyles.flex} />
      <View style={pageStyles.deleteWalletWrap}>
        <Text onPress={() => navigationService.navigate('AccountCancelation')} style={pageStyles.deleteWalletText}>
          Delete wallet
        </Text>
      </View>

      <View style={{ display: 'none' }}>
        <ImageWithUploadFunc avatarSize={pTd(80)} ref={uploadRef} title={''} imageUrl={avatar || ''} />
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
    color: theme.colors.textBase1,
    textAlign: 'center',
    marginRight: pTd(4),
  },
  editIcon: {
    position: 'absolute',
    right: pTd(0),
    bottom: pTd(0),
    zIndex: 1,
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
    borderColor: darkColors.borderBase1,
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
    fontSize: 16,
    textAlign: 'center',
  },
}));
