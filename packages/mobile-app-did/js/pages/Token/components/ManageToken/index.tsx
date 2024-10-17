import React, { useMemo } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import CommonAvatar from 'components/CommonAvatar';
import CommonSwitch from 'components/CommonSwitch';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { IUserTokenItemResponse, IUserTokenItem } from '@portkey-wallet/types/types-ca/token';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';

interface IManageTokenProps {
  onHandleTokenItem?: (item: IUserTokenItem, added: boolean) => void;
  item: IUserTokenItemResponse;
}

const ManageToken: React.FC<IManageTokenProps> = ({ item, onHandleTokenItem }) => {
  const { currentNetwork } = useWallet();
  const displayStatus = useMemo(() => {
    if (item.displayStatus === 'All') {
      return 'All Networks';
    } else if (item.displayStatus === 'None') {
      return 'Balance Hidden';
    } else {
      const chainId = item.tokens?.find(token => token.isDisplay)?.chainId;
      if (chainId) {
        return formatChainInfoToShow(chainId, currentNetwork);
      } else {
        return '';
      }
    }
  }, [currentNetwork, item.displayStatus, item.tokens]);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <View style={styles.titleLeft}>
          <CommonAvatar
            hasBorder
            shapeType="circular"
            title={item.symbol}
            imageUrl={item.imageUrl}
            avatarSize={pTd(32)}
          />
          <View style={styles.titleTextWrap}>
            <Text style={styles.symbolText}>{item.label || item.symbol}</Text>
            <Text style={styles.networkText}>{displayStatus}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            OverlayModal.hide();
          }}
          style={styles.closeImage}>
          <Svg icon="close2" size={pTd(22)} color={defaultColors.bg34} />
        </TouchableOpacity>
      </View>
      {item.tokens?.map((token, _) => {
        return (
          <View key={token.chainId} style={styles.itemWrap}>
            <Text style={styles.chainText}>{formatChainInfoToShow(token.chainId, currentNetwork)}</Text>
            <CommonSwitch
              value={token.isDisplay}
              onValueChange={() => {
                onHandleTokenItem && onHandleTokenItem(token, token.isDisplay ?? false);
                OverlayModal.hide();
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: defaultColors.white,
    marginBottom: pTd(24),
  },
  titleWrap: {
    height: pTd(64),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  titleLeft: {
    marginLeft: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextWrap: {
    marginLeft: pTd(12),
  },
  symbolText: {
    fontSize: pTd(14),
    color: defaultColors.neutralPrimaryTextColor,
    ...fonts.mediumFont,
  },
  networkText: {
    fontSize: pTd(12),
    color: defaultColors.neutralTertiaryText,
  },
  closeImage: {
    padding: pTd(14),
  },
  itemWrap: {
    height: pTd(56),
    paddingLeft: pTd(16),
    paddingRight: pTd(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chainText: {
    color: defaultColors.neutralPrimaryTextColor,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
});

export const showManageToken = ({ item, onHandleTokenItem }: IManageTokenProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<ManageToken item={item} onHandleTokenItem={onHandleTokenItem} />, {
    position: 'bottom',
    animated: true,
  });
};