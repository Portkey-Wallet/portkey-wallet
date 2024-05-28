import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import Svg from 'components/Svg';
import { CopyButton } from 'components/CopyButton';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useCurrentCaInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

const CopyUserAddress: React.FC = () => {
  const isMainnet = useIsMainnet();
  const caInfo = useCurrentCaInfo();

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
      {caInfoList.map((item, index) => {
        return (
          <View key={index + ''} style={styles.itemWrap}>
            <View>
              <Text style={styles.chainText}>{transNetworkText(item.chainId, !isMainnet)}</Text>
              <Text style={styles.addressText}>
                {formatStr2EllipsisStr(addressFormat(item.address, item?.chainId), 8)}
              </Text>
            </View>
            <CopyButton copyContent={copyContent({ address: item.address, chainId: item.chainId })} />
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
    color: defaultColors.font5,
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
    borderColor: defaultColors.border11,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chainText: {
    color: defaultColors.font5,
    fontSize: pTd(14),
    ...fonts.mediumFont,
  },
  addressText: {
    color: defaultColors.font11,
    fontSize: pTd(12),
  },
});

export const showCopyUserAddress = () => {
  Keyboard.dismiss();
  OverlayModal.show(<CopyUserAddress />, {
    position: 'bottom',
    animated: true,
  });
};
