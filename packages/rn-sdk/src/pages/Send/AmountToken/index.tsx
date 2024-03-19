import React from 'react';
import { Input } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextM, TextS } from 'components/CommonText';
import { useCommonNetworkInfo, useSymbolImages } from 'components/TokenOverlay/hooks';
import { useLanguage } from 'i18n/hooks';
import { useCurrentNetworkType } from 'model/hooks/network';
import { ZERO } from '@portkey-wallet/constants/misc';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { formatAmountShow, divDecimals } from '@portkey-wallet/utils/converter';
import { parseInputChange } from '@portkey-wallet/utils/input';
import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { useAccountTokenBalanceList } from 'model/hooks/balance';

interface AmountTokenProps {
  onPressMax: () => void;
  balanceShow: number | string;
  sendTokenNumber: string;
  setSendTokenNumber: any;
  selectedAccount: any;
  selectedToken: IToSendAssetParamsType;
}

export default function AmountToken({
  onPressMax,
  balanceShow,
  sendTokenNumber,
  setSendTokenNumber,
  selectedToken,
}: AmountTokenProps) {
  const { t } = useLanguage();
  const { defaultToken } = useCommonNetworkInfo();
  const networkType = useCurrentNetworkType();
  const isTestNet = useMemo(() => networkType !== 'MAINNET', [networkType]);
  const { balanceList } = useAccountTokenBalanceList();
  const isTokenHasPrice = useMemo(
    () => balanceList.find(it => it.symbol === selectedToken.symbol),
    [balanceList, selectedToken.symbol],
  );

  const symbolImages = useSymbolImages();
  const aelfIconName = useMemo(() => (isTestNet ? 'testnet' : 'mainnet'), [isTestNet]);

  const formattedTokenNameToSuffix = useMemo(() => {
    return selectedToken?.symbol?.length > 5 ? `${selectedToken?.symbol.slice(0, 5)}...` : selectedToken?.symbol;
  }, [selectedToken?.symbol]);

  return (
    <View style={styles.amountWrap}>
      <View style={styles.top}>
        <Text style={styles.topTitle}>{t('Amount')}</Text>
        <Text style={styles.topBalance}>
          {`${t('Balance')} ${formatAmountShow(divDecimals(balanceShow, selectedToken.decimals))} ${
            selectedToken.symbol
          }`}
        </Text>
      </View>
      <View style={styles.middle}>
        <View style={styles.middleLeft}>
          <CommonAvatar
            hasBorder
            shapeType="circular"
            title={selectedToken.symbol}
            svgName={selectedToken.symbol === defaultToken.symbol ? aelfIconName : undefined}
            imageUrl={selectedToken.imageUrl || symbolImages[selectedToken.symbol]}
            avatarSize={28}
            style={styles.avatarStyle}
          />
          <Text style={styles.symbolName}>{formattedTokenNameToSuffix}</Text>
        </View>
        <View style={styles.middleRight}>
          <Input
            autoFocus
            onFocus={() => {
              if (sendTokenNumber === '0') setSendTokenNumber('');
            }}
            keyboardType="numeric"
            value={sendTokenNumber}
            maxLength={18}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[styles.inputStyle, sendTokenNumber === '0' && FontStyles.font7]}
            onChangeText={v => {
              const newAmount = parseInputChange(v.trim(), ZERO, 4);
              setSendTokenNumber(newAmount);
            }}
          />
          <TouchableOpacity style={styles.max} onPress={onPressMax}>
            <TextM style={FontStyles.font4}>{t('Max')}</TextM>
          </TouchableOpacity>
        </View>
      </View>
      {!isTestNet && isTokenHasPrice && (
        <View style={styles.bottom}>
          <TextS style={styles.topBalance}>
            {`$ ${formatAmountShow(
              ZERO.plus(sendTokenNumber).multipliedBy(
                balanceList.find(ele => ele.symbol === selectedToken.symbol)?.price || '0',
              ),
              2,
            )}`}
          </TextS>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  amountWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(16),
    display: 'flex',
    justifyContent: 'space-around',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: defaultColors.font3,
    fontSize: pTd(14),
  },
  topBalance: {
    color: defaultColors.font3,
    fontSize: pTd(12),
  },
  middle: {
    marginTop: pTd(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  middleLeft: {
    minWidth: pTd(114),
    height: pTd(40),
    backgroundColor: defaultColors.bg4,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(6, 10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStyle: {
    fontSize: pTd(16),
  },
  symbolName: {
    flex: 1,
    textAlign: 'center',
    color: defaultColors.font5,
  },
  middleRight: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerStyle: {
    width: '100%',
    minWidth: pTd(143),
    maxWidth: pTd(183),
    height: pTd(40),
    overflow: 'hidden',
  },
  inputContainerStyle: {
    borderColor: 'white', // how to delete bottom border
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: pTd(40),
    borderColor: defaultColors.bg1,
    // backgroundColor: 'green',
    lineHeight: pTd(28),
    paddingRight: pTd(20),
    color: defaultColors.font5,
    fontSize: pTd(24),
  },
  usdtNumSent: {
    position: 'absolute',
    right: 0,
    bottom: pTd(5),
    borderBottomColor: defaultColors.border6,
    color: defaultColors.font3,
  },
  bottom: {
    paddingLeft: pTd(120),
    marginTop: pTd(8.5),
  },
  max: {
    position: 'absolute',
    right: 0,
    bottom: pTd(9),
    zIndex: 100,
  },
});
