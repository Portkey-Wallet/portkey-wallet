import React from 'react';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { ChainId } from '@portkey-wallet/types';
import ActionSheet from 'components/ActionSheet';
import i18n from 'i18n';
import Touchable from 'components/Touchable';
import { useSideChainTokenReceiveTipSetting } from '@portkey-wallet/hooks/hooks-ca/misc';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextStyleType, ViewStyleType } from 'types/styles';

export type TTopViewProps = { chainId: ChainId; style?: ViewStyleType; textStyle?: TextStyleType };

export function TipView({ chainId, style, textStyle }: TTopViewProps) {
  const list = [
    'Copy your wallet address.',
    `Remove the "ELF_" prefix and "_${chainId}" suffix.`,
    'Use only the middle part of the address.',
  ];
  return (
    <View style={style}>
      <TextM style={[FontStyles.font3, textStyle]}>
        If you wish to receive assets from exchanges, please note that they will not be credited to your SideChain
        address, and you cannot make the transfer through QR code scanning.
      </TextM>
      <TextM style={[styles.topSpacing, FontStyles.font3, textStyle]}>To receive, please follow these steps:</TextM>
      <View style={styles.topSpacing}>
        {list.map(i => (
          <View key={i} style={[GStyles.flexRow, GStyles.itemCenter]}>
            <View style={styles.markView} />
            <View style={GStyles.flex1}>
              <TextM style={[FontStyles.font3, textStyle]}>{i}</TextM>
            </View>
          </View>
        ))}
      </View>
      <TextM style={[styles.topSpacing, FontStyles.font3, textStyle]}>
        Upon completing the transaction, the assets will be sent to your MainChain address.
      </TextM>
    </View>
  );
}

function ReceiveTip({ chainId, style }: TTopViewProps) {
  const { showSideChainTokenReceiveTip, setSideChainTokenReceiveTip } = useSideChainTokenReceiveTipSetting();
  return (
    <View>
      <TipView chainId={chainId} style={style} />
      <View style={[GStyles.flexRow, GStyles.itemCenter, styles.selectBox]}>
        <Touchable onPress={() => setSideChainTokenReceiveTip(!showSideChainTokenReceiveTip)}>
          <Svg icon={!showSideChainTokenReceiveTip ? 'selected' : 'unselected'} size={pTd(20)} />
        </Touchable>
        <TextM style={GStyles.flex1}>{`Don't show this again`}</TextM>
      </View>
    </View>
  );
}

export const showReceiveTip = (params: TTopViewProps) => {
  ActionSheet.alert({
    title: i18n.t('Receive from exchange account?'),
    message: <ReceiveTip {...params} />,
    buttons: [
      {
        title: i18n.t('I Know'),
        type: 'primary',
      },
    ],
  });
};

export default {
  showReceiveTip,
};

const styles = StyleSheet.create({
  markView: { width: 4, height: 4, borderRadius: 2, marginHorizontal: pTd(8), ...BGStyles.bg20 },
  topSpacing: GStyles.marginTop(8),
  selectBox: {
    marginTop: 28,
  },
});
