import React, { useCallback } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import Svg from 'components/Svg';
import { CopyButton } from 'components/CopyButton';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

const CopyUserAddress: React.FC = () => {
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();

  const copyContent = useCallback(
    (item: { address: string; chainId: ChainId }) => `ELF_${item.address}_${item.chainId}`,
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.titleText}>Copy Address</Text>
        <TouchableOpacity
          onPress={() => {
            OverlayModal.hide();
          }}
          style={styles.closeImage}>
          <Svg icon="close2" size={pTd(22)} iconStyle={styles.closeImage} color={defaultColors.bg34} />
        </TouchableOpacity>
      </View>
      {caAddressInfos.map((item, index) => {
        return (
          <View key={index} style={styles.itemWrap}>
            <View>
              <Text style={styles.chainText}>{transNetworkText(item.chainId, !isMainnet)}</Text>
              <Text style={styles.addressText}>
                {formatStr2EllipsisStr(addressFormat(item.caAddress, item?.chainId), 8)}
              </Text>
            </View>
            <CopyButton copyContent={copyContent({ address: item.caAddress, chainId: item.chainId })} />
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
    marginBottom: pTd(8),
  },
  titleWrap: {
    height: pTd(44),
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

export const showCopyUserAddress = () => {
  Keyboard.dismiss();
  OverlayModal.show(<CopyUserAddress />, {
    position: 'bottom',
    animated: true,
  });
};
