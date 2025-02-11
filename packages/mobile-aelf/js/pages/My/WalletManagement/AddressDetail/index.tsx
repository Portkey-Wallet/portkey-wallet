import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { LOCAL_AVATARS, LOCAL_AVATARS_ARRAY } from 'assets/image/avatars';

import { Text } from 'react-native';
import { darkColors } from 'assets/theme';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { TextXXXL } from 'components/CommonText';
import ChangeOverlay from '../../WalletHome/MyWallet/components/ChangePictureOverlay';
import RenameOverlay from '../../WalletHome/MyWallet/components/RenameOverlay';
import CommonAvatar from 'components/CommonAvatar';
import fonts from 'assets/theme/fonts';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { updateAccount } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

export const AddressDetail: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const pageStyles = getStyles();
  const walletList = useWalletListState();
  const { currentWalletKey, currentAddress } = useRouterParams<{
    currentWalletKey: string;
    currentAddress: string;
  }>();
  const [currentAccount, setCurrentAccount] = useState<TAccountInfo>();
  const [avatar, setAvatar] = useState<string | number>();
  const [nickName, setNickName] = useState<string>('');
  useEffect(() => {
    if (!walletList.length) {
      return;
    }
    const currentWallet = walletList.find(item => item.key === currentWalletKey);
    const accountSelected = currentWallet?.accountList.find(item => item.address === currentAddress);
    setCurrentAccount(accountSelected);
    setAvatar(LOCAL_AVATARS[accountSelected?.icon || 'avatar_1']);
    setNickName(accountSelected?.name || '');
    console.log('address detail', accountSelected);
  }, [walletList, currentWalletKey, currentAddress]);

  const handleSelectPhoto = useCallback(
    async (iconKey: any) => {
      const foundKey = Object.entries(LOCAL_AVATARS).find(([_, value]) => value === iconKey)?.[0];
      console.log('handleSelectPhoto: ', iconKey, foundKey, LOCAL_AVATARS);
      if (!foundKey || !currentAccount) {
        return;
      }
      // setCurrentAccount(newAccount);
      setAvatar(LOCAL_AVATARS[foundKey]);
      const newAccount = {
        ...currentAccount,
        icon: foundKey || 'avatar_1',
      };
      dispatch(
        updateAccount({
          walletKey: currentWalletKey,
          accountAddress: currentAddress,
          account: newAccount,
        }),
      );
    },
    [currentAccount, currentAddress, currentWalletKey, dispatch],
  );

  const handleRename = useCallback(
    async (name: string) => {
      if (!name || !currentAccount) {
        return;
      }
      setNickName(name);
      const newAccount = {
        ...currentAccount,
        name,
      };
      dispatch(
        updateAccount({
          walletKey: currentWalletKey,
          accountAddress: currentAddress,
          account: newAccount,
        }),
      );
    },
    [currentAccount, currentAddress, currentWalletKey, dispatch],
  );

  return (
    <PageContainer
      titleDom={t('Address details')}
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
                nickName: nickName,
                // avatarList: LOCAL_AVATARS_REQUIRE_ARRAY || [],
                avatarList: LOCAL_AVATARS_ARRAY || [],
                avatarListLocal: true,
                photoUpload: () => {
                  console.log('no photoUpload here');
                },
                photoUploadHide: true,
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
                  imageUrl={typeof avatar === 'string' ? avatar : ''}
                  localImage={typeof avatar === 'number' ? avatar : undefined}
                  title={nickName}
                />
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
            marginRight: pTd(-16),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TextXXXL style={[pageStyles.nicknameText, fonts.BGMediumFont]}>{nickName}</TextXXXL>
          <Touchable
            onPress={() => {
              RenameOverlay.showModal({
                title: t('Rename wallet'),
                nickName: nickName,
                onChange: handleRename,
              });
            }}>
            <Svg icon="edit_thin" size={pTd(20)} />
          </Touchable>
        </View>
      </View>
      {/*<ProfileAddressSectionV2 title={'My addresses'} isMySelf addressList={caInfoList} />*/}
      <View style={pageStyles.flex} />
      <View style={pageStyles.deleteWalletWrap}>
        <Text
          onPress={() => {
            // TODO:
            // navigationService.navigate('AccountCancelation')
          }}
          style={pageStyles.deleteWalletText}>
          Remove address
        </Text>
      </View>

      {/*<View style={{ display: 'none' }}>*/}
      {/*  <ImageWithUploadFunc avatarSize={pTd(80)} ref={uploadRef} title={''} imageUrl={avatar || ''} />*/}
      {/*</View>*/}
    </PageContainer>
  );
};

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
    right: pTd(-10),
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
