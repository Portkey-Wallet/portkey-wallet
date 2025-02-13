import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { LOCAL_AVATARS, LOCAL_AVATARS_ARRAY } from 'assets/image/avatars';
import fonts from 'assets/theme/fonts';
import { Text } from 'react-native';
import { darkColors } from 'assets/theme';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { TextXXXL } from 'components/CommonText';
import ChangeOverlay from '../../WalletHome/MyWallet/components/ChangePictureOverlay';
import RenameOverlay from '../../WalletHome/MyWallet/components/RenameOverlay';
import CommonAvatar from 'components/CommonAvatar';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useAddress } from '../hooks/useAddress';
import { getAddressCardStyles } from '../styles';
import { useMultiChainAddressesModal } from 'hooks/useMultiChainAddressesModal';
import { showModal } from './BackupAddressOverlay';

export const AddressDetail: React.FC = () => {
  const { t } = useLanguage();
  const pageStyles = getStyles();
  const addressCardStyles = getAddressCardStyles();
  const walletList = useWalletListState();
  const { currentWalletKey, currentAddress } = useRouterParams<{
    currentWalletKey: string;
    currentAddress: string;
  }>();
  const [currentAccount, setCurrentAccount] = useState<TAccountInfo>();
  const [currentWallet, setCurrentWallet] = useState<TWalletInfo>();
  const [avatar, setAvatar] = useState<string | number>();
  const [nickName, setNickName] = useState<string>('');
  const { updateAddressName, updateAddressIcon, removeAddress } = useAddress({
    currentAccount,
    currentAddress,
    currentWalletKey,
  });
  const { showMultiChainAddressesModal } = useMultiChainAddressesModal();

  useEffect(() => {
    if (!walletList.length) {
      return;
    }
    const walletSelected = walletList.find(item => item.key === currentWalletKey);
    const accountSelected = walletSelected?.accountList.find(item => item.address === currentAddress);
    setCurrentAccount(accountSelected);
    setCurrentWallet(walletSelected);
    setAvatar(LOCAL_AVATARS[accountSelected?.icon || 'avatar_1']);
    setNickName(accountSelected?.name || '');
    console.log('address detail', accountSelected, walletSelected);
  }, [walletList, currentWalletKey, currentAddress]);

  return (
    <PageContainer
      titleDom={t('Address details')}
      safeAreaColor={['black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.userInfoWrap}>
        <View style={pageStyles.avatarWrap}>
          <Touchable
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
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
                selectPhoto: updateAddressIcon,
              });
            }}>
            <View
              style={{
                width: pTd(80),
                height: pTd(80),
              }}>
              <View style={pageStyles.avatarContainer}>
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
        <View style={pageStyles.nickName}>
          <TextXXXL style={[pageStyles.nicknameText, fonts.BGMediumFont]}>{nickName}</TextXXXL>
          <Touchable
            onPress={() => {
              RenameOverlay.showModal({
                title: t('Rename wallet'),
                nickName: nickName,
                onChange: updateAddressName,
              });
            }}>
            <Svg icon="edit_thin" size={pTd(20)} />
          </Touchable>
        </View>
      </View>
      <View style={pageStyles.flex}>
        <Touchable
          onPress={() => {
            if (!currentAccount) {
              return;
            }
            showMultiChainAddressesModal({
              address: currentAccount?.address,
            });
          }}>
          <View style={[addressCardStyles.card, pageStyles.cardContainer]}>
            <View style={addressCardStyles.info}>
              <View>
                <Text style={[addressCardStyles.title, addressCardStyles.titleRegular]}>Address</Text>
              </View>
            </View>
            <View style={addressCardStyles.rightContainer}>
              <Text style={pageStyles.subText}>Multichain</Text>
              <CommonAvatar
                hasBorder={false}
                style={addressCardStyles.iconBase}
                svgName="chevron_right"
                avatarSize={pTd(12)}
                height={pTd(12)}
                width={pTd(12)}
              />
            </View>
          </View>
        </Touchable>

        <View style={addressCardStyles.cardListContainer}>
          {currentWallet?.AESEncryptMnemonic && (
            <>
              <Touchable
                onPress={() => {
                  if (!currentWallet || !currentAccount) {
                    return;
                  }
                  showModal({
                    type: 'seed phrase',
                    walletToBeBackup: currentWallet,
                    accountToBeBackup: currentAccount,
                  });
                }}
                style={[addressCardStyles.card, pageStyles.cardContainer, pageStyles.marginBottom0]}>
                <View style={addressCardStyles.info}>
                  <View>
                    <Text style={[addressCardStyles.title, addressCardStyles.titleRegular]}>Show Recovery phrase</Text>
                  </View>
                </View>
                <View style={addressCardStyles.rightContainer}>
                  {!currentWallet?.isBackup && (
                    <Text style={[pageStyles.subText, pageStyles.notBackup]}>Not backup</Text>
                  )}
                  <CommonAvatar
                    hasBorder={false}
                    style={addressCardStyles.iconBase}
                    svgName="chevron_right"
                    avatarSize={pTd(12)}
                    height={pTd(12)}
                    width={pTd(12)}
                  />
                </View>
              </Touchable>
              <View style={addressCardStyles.divider} />
            </>
          )}
          <Touchable
            onPress={() => {
              if (!currentWallet || !currentAccount) {
                return;
              }
              showModal({
                type: 'private key',
                walletToBeBackup: currentWallet,
                accountToBeBackup: currentAccount,
              });
            }}
            style={[addressCardStyles.card, pageStyles.cardContainer, pageStyles.marginBottom0]}>
            <View style={addressCardStyles.info}>
              <View>
                <Text style={[addressCardStyles.title, addressCardStyles.titleRegular]}>Show Private key</Text>
              </View>
            </View>
            <View style={addressCardStyles.rightContainer}>
              <CommonAvatar
                hasBorder={false}
                style={addressCardStyles.iconBase}
                svgName="chevron_right"
                avatarSize={pTd(12)}
                height={pTd(12)}
                width={pTd(12)}
              />
            </View>
          </Touchable>
        </View>
      </View>
      <View style={pageStyles.deleteWalletWrap}>
        <Text
          onPress={() => {
            removeAddress(() => {
              CommonToast.success('Wallet removed');
              navigationService.pop(2);
              navigationService.push('WalletManagement');
            });
          }}
          style={pageStyles.deleteWalletText}>
          Remove address
        </Text>
      </View>
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
    marginBottom: pTd(40),
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginHorizontal: pTd(8),
    position: 'relative',
  },
  avatarWrap: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  nickName: {
    marginTop: pTd(12),
    marginRight: pTd(-16),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
  cardContainer: {
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase2,
    height: pTd(56),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(16),
  },
  marginBottom0: {
    marginBottom: pTd(0),
  },
  subText: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginRight: pTd(12),
  },
  notBackup: {
    color: theme.colors.textDanger1,
  },
  deleteWalletWrap: {
    height: pTd(48),
    alignContent: 'center',
    justifyContent: 'center',
  },
  deleteWalletText: {
    ...fonts.SGMediumFont,
    color: theme.colors.textDanger1,
    fontSize: 16,
    textAlign: 'center',
  },
}));
