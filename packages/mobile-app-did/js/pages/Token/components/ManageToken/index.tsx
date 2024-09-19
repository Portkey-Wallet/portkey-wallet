import React, { useCallback } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

interface IManageTokenProps {
  item: IUserTokenItemResponse;
}

const ManageToken: React.FC<IManageTokenProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.titleText}>{item.symbol || item.label}</Text>
        <TouchableOpacity
          onPress={() => {
            OverlayModal.hide();
          }}
          style={styles.closeImage}>
          <Svg icon="close2" size={pTd(22)} iconStyle={styles.closeImage} color={defaultColors.bg34} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: defaultColors.white,
    marginBottom: pTd(8),
  },
  titleWrap: {
    height: pTd(64),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  titleText: {
    fontSize: pTd(16),
    color: defaultColors.neutralPrimaryTextColor,
    ...fonts.mediumFont,
  },
  closeImage: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: pTd(12),
  },
  itemWrap: {
    marginHorizontal: pTd(16),
    marginBottom: pTd(16),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(20),
    borderWidth: 0.5,
    borderColor: defaultColors.neutralDivider,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chainText: {
    color: defaultColors.neutralPrimaryTextColor,
    fontSize: pTd(14),
    lineHeight: pTd(22),
    ...fonts.mediumFont,
  },
  addressText: {
    marginTop: pTd(4),
    color: defaultColors.neutralTertiaryText,
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
});

export const showManageToken = ({ item }: IManageTokenProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<ManageToken item={item} />, {
    position: 'bottom',
    animated: true,
  });
};
