import { getCardStyles } from '../styles';
import { Text, View } from 'react-native';
import CommonTooltip from 'components/CommonTooltip';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import React from 'react';
import Touchable from 'components/Touchable';
import { updateWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import RenameOverlay from '../../WalletHome/MyWallet/components/RenameOverlay';
import ActionSheet from 'components/ActionSheet';
import { useRemoveWallet } from '../hooks/useRemoveWallet';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';

export const AddressCardHeader = ({
  privateKeyTipShow = false,
  useManageStyle = false,
  removeWalletDisabled = false,
  walletInfo,
}: {
  privateKeyTipShow?: boolean;
  useManageStyle?: boolean;
  removeWalletDisabled?: boolean;
  walletInfo?: TWalletInfo;
}) => {
  const cardStyles = getCardStyles();
  const walletName = walletInfo?.name || 'Wallet 1';
  const isPrivateKeyWallet = !walletInfo?.AESEncryptMnemonic;
  const dispatch = useAppCommonDispatch();
  const { removeWallet } = useRemoveWallet();

  return (
    <>
      {!useManageStyle ? (
        <View alias-name="show" style={cardStyles.showHeader}>
          <Text style={cardStyles.addressNameShow}>{walletName}</Text>
          {privateKeyTipShow && isPrivateKeyWallet && (
            <CommonTooltip
              alias-name="privatekey-only"
              iconSize={pTd(16)}
              tooltipProps={{
                title: 'Notice',
                description: 'Wallets imported using private key do not support the addition of addresses.',
              }}
            />
          )}
        </View>
      ) : (
        <View alias-name="edit" style={cardStyles.editableHeader}>
          <Text style={cardStyles.addressNameEdit}>{walletName}</Text>
          <View style={cardStyles.editableHeaderRight}>
            {/*<Touchable onPress={showRenameWalletModal}>*/}
            <Touchable
              onPress={() => {
                RenameOverlay.showModal({
                  title: 'Rename your wallet',
                  nickName: walletName,
                  // avatarInfo: {
                  //   localAvatar: LOCAL_AVATARS.avatar_1,
                  //   size: pTd(80),
                  // },
                  avatarInfo: {
                    avatar: 'wallet_fill',
                    size: pTd(32),
                  },
                  onChange: value => {
                    if (!walletInfo) {
                      return;
                    }
                    dispatch(
                      updateWallet({
                        wallet: {
                          ...walletInfo,
                          name: value,
                        },
                      }),
                    );
                  },
                });
              }}>
              <Svg size={pTd(24)} icon="edit_thin" />
            </Touchable>
            <Svg size={pTd(16)} icon="Vector 2" iconStyle={cardStyles.iconVector2} />
            <Touchable
              onPress={() => {
                if (removeWalletDisabled) {
                  CommonToast.fail('This is the only wallet and cannot be removed.');
                  return;
                }
                ActionSheet.alert({
                  isCloseShow: true,
                  title: <Svg size={pTd(32)} icon="error" color={defaultColors.iconBase1} />,
                  title2: 'Ensure your seed phrase is backed up before removal',
                  message:
                    'Please make sure your seed phrase is securely backed up before removing the wallet. Losing access to your seed phrase or sharing it with others could lead to permanent loss of your assets.',
                  buttonGroupDirection: 'column',
                  buttons: [
                    {
                      title: 'View seed phrase',
                      type: 'primary',
                    },
                    {
                      title: 'Remove',
                      type: 'warningNoBorder',
                      onPress: () => {
                        if (!walletInfo) {
                          return;
                        }
                        removeWallet(walletInfo.key, () => {
                          CommonToast.success('Wallet removed');
                          console.log('removeWallet success');
                          navigationService.pop(1);
                          navigationService.push('WalletManagement', {
                            showManaging: true,
                          });
                        });
                      },
                    },
                  ],
                });
              }}>
              <Svg
                size={pTd(24)}
                icon="delete"
                color={removeWalletDisabled ? defaultColors.iconDisabled : defaultColors.iconDanger2}
              />
            </Touchable>
          </View>
        </View>
      )}
    </>
  );
};
