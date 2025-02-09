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
// import { LOCAL_AVATARS } from 'assets/image/avatars';
// import avatar_1 from "../../../../assets/image/avatars/avatar_1.png";

export const AddressCardHeader = ({
  privateKeyTipShow = false,
  useManageStyle = false,
  walletInfo,
}: {
  privateKeyTipShow?: boolean;
  useManageStyle?: boolean;
  walletInfo?: TWalletInfo;
}) => {
  const cardStyles = getCardStyles();
  const walletName = walletInfo?.name || 'Wallet 1';
  const isPrivateKeyWallet = !walletInfo?.AESEncryptMnemonic;
  const dispatch = useAppCommonDispatch();

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
            <Svg size={pTd(24)} icon="delete" color={defaultColors.iconDanger2} />
          </View>
        </View>
      )}
    </>
  );
};
