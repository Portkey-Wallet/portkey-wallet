import React, { useCallback } from 'react';
import { View, Keyboard, Text } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { makeStyles } from '@rneui/themed';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import CommonAvatar from 'components/CommonAvatar';
import { useTheme } from '@rneui/themed';
import CommonToast from 'components/CommonToast';
import { setStringAsync } from 'expo-clipboard';

const CopyUserAddress: React.FC = () => {
  const caAddressInfos = useCaAddressInfoList();
  const styles = getStyles();
  const currentChainList = useCurrentChainList();

  const getChainInfoByChainId = useCallback(
    (chainId: ChainId) => {
      if (!currentChainList) {
        return undefined;
      }
      return currentChainList.find(chain => chain.chainId === chainId);
    },
    [currentChainList],
  );

  const { theme } = useTheme();

  const onCopyAddress = useCallback(({ address, chainId }: { address: string; chainId: ChainId }) => {
    setStringAsync(`ELF_${address}_${chainId}`);
    CommonToast.success('Address copied');
    OverlayModal.hide();
  }, []);

  return (
    <ModalBody title={'Your addresses'} modalBodyType="bottom">
      {caAddressInfos?.reverse()?.map((item, index) => {
        return (
          <View key={index} style={styles.itemWrap}>
            <View style={styles.leftWrap}>
              <CommonAvatar imageUrl={getChainInfoByChainId(item.chainId)?.chainImageUrl} style={styles.icon} />
              <View style={styles.textWrap}>
                <Text style={styles.chainText}>{formatChainInfoToShow(item.chainId)}</Text>
                <Text style={styles.addressText}>
                  {formatStr2EllipsisStr(addressFormat(item.caAddress, item?.chainId), 8)}
                </Text>
              </View>
            </View>
            <Touchable
              style={styles.svgWrap}
              onPress={() => onCopyAddress({ address: item.caAddress, chainId: item.chainId })}>
              <Svg icon="copy" size={pTd(24)} color={theme.colors.iconBase2} />
            </Touchable>
          </View>
        );
      })}
    </ModalBody>
  );
};

const getStyles = makeStyles(theme => ({
  itemWrap: {
    marginHorizontal: pTd(16),
    marginTop: pTd(12),
    paddingTop: pTd(12),
    height: pTd(72),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    width: pTd(24),
    height: pTd(24),
  },
  textWrap: {
    marginLeft: pTd(12),
  },
  chainText: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  addressText: {
    marginTop: pTd(4),
    color: theme.colors.textBase2,
    fontSize: pTd(14),
    lineHeight: pTd(16),
  },
  svgWrap: {},
}));

export const showCopyUserAddress = () => {
  Keyboard.dismiss();
  OverlayModal.show(<CopyUserAddress />, {
    position: 'bottom',
    animated: true,
  });
};
