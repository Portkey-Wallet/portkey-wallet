import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { pTd } from 'utils/unit';
import { parseInputChange } from '@portkey-wallet/utils/input';
import { ZERO } from '@portkey-wallet/constants/misc';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { Input } from '@rneui/themed';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useLanguage } from 'i18n/hooks';
import CommonAvatar from 'components/CommonAvatar';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';

import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetCurrentAccountTokenPrice, useIsTokenHasPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useInputFocus } from 'hooks/useInputFocus';

interface AmountTokenProps {
  onPressMax: () => void;
  balanceShow: number | string;
  sendTokenNumber: string;
  setSendTokenNumber: any;
  selectedAccount: any;
  selectedToken: IToSendAssetParamsType;
  setSelectedToken: any;
}

export default function AmountToken({
  onPressMax,
  balanceShow,
  sendTokenNumber,
  setSendTokenNumber,
  selectedToken,
}: AmountTokenProps) {
  const { t } = useLanguage();
  const defaultToken = useDefaultToken();
  const iptRef = useRef<TextInput>(null);
  useInputFocus(iptRef);
  const isTestNet = useIsTestnet();
  const isTokenHasPrice = useIsTokenHasPrice(selectedToken?.symbol);

  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();

  const symbolImages = useSymbolImages();
  const aelfIconName = useMemo(() => (isTestNet ? 'testnet' : 'mainnet'), [isTestNet]);

  const formattedTokenNameToSuffix = useMemo(() => {
    return selectedToken?.symbol?.length > 5 ? `${selectedToken?.symbol.slice(0, 5)}...` : selectedToken?.symbol;
  }, [selectedToken?.symbol]);

  useEffectOnce(() => {
    getTokenPrice(selectedToken.symbol);
  });

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
            shapeType="circular"
            svgName={selectedToken.symbol === defaultToken.symbol ? aelfIconName : undefined}
            imageUrl={symbolImages[selectedToken.symbol] || ''}
            avatarSize={28}
          />
          <Text style={styles.symbolName}>{formattedTokenNameToSuffix}</Text>
        </View>
        <View style={styles.middleRight}>
          <Input
            autoFocus
            ref={iptRef}
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
              ZERO.plus(sendTokenNumber).multipliedBy(tokenPriceObject[selectedToken.symbol]),
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
  imgStyle: {
    width: pTd(28),
    height: pTd(28),
    lineHeight: pTd(28),
    borderColor: defaultColors.border1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(14),
    textAlign: 'center',
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
