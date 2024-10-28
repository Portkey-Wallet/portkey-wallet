import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { makeStyles } from '@rneui/themed';
import TokenBalanceShow from 'components/TokenBalanceShow';
import TokenAmountInput from 'components/TokenAmountInput';
import CommonButton from 'components/CommonButton';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';

export interface IEBridgeCardProps {
  styleProps?: ViewStyle;
  tokenInfo: TokenItemShowType;
  isConnectWallet: boolean;
}

export default function EBridgeCard(props: IEBridgeCardProps) {
  const { styleProps, tokenInfo, isConnectWallet } = props;
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [usdValue, setUsdValue] = useState('');
  const [isExceed, setIsExceed] = useState(false);
  const styles = getStyles();
  const btnDisabled = useMemo(() => {
    return isConnectWallet && (!(value || usdValue) || isExceed);
  }, [isConnectWallet, isExceed, usdValue, value]);
  const btnTitleText = useMemo(() => {
    if (!isConnectWallet) return 'Connect external wallet';
    if (isExceed) return `Insufficient ${tokenInfo.label || tokenInfo.symbol} balance`;
    return 'Preview';
  }, [isConnectWallet, isExceed, tokenInfo]);
  const onPressBtn = useCallback(() => {
    navigationService.navigate('ReceivePreview');
  }, []);

  return (
    <View style={[styleProps, styles.eBridgeCardContainer]}>
      <View>
        <TokenBalanceShow
          symbol={tokenInfo.symbol}
          label={tokenInfo.label}
          onPressMax={() => {
            // TODO
          }}
          imageUrl={tokenInfo.imageUrl}
          balanceShow="4.12"
          styleProps={{ marginTop: pTd(24) }}
        />
        <TokenAmountInput
          value={value}
          usdValue={usdValue}
          symbol={tokenInfo.symbol}
          label={tokenInfo.label}
          decimals={tokenInfo.decimals}
          warningTip={isExceed ? 'Exceeds available balance' : undefined}
          editable={isConnectWallet}
          setUsdValue={v => {
            setUsdValue(v);
            // TODO exceed value
          }}
          setValue={v => {
            setValue(v);
            // TODO exceed usdValue
          }}
        />
      </View>
      <View style={styles.footerContainer}>
        {!isConnectWallet && (
          <View style={styles.tipContainer}>
            <Svg icon="info" iconStyle={{ marginRight: pTd(12) }} />
            <TextL style={styles.tipInfoMessage}>
              {t(
                `To receive this token from the Ethereum network, connect to an external wallet and bridge the assets to your destination network.`,
              )}
            </TextL>
          </View>
        )}
        <CommonButton
          style={styles.commonButton}
          disabled={btnDisabled}
          type="primary"
          title={t(btnTitleText)}
          onPress={onPressBtn}
        />
        {!isConnectWallet && (
          <View style={styles.poweredWrap}>
            <Text style={styles.poweredText}>Powered by</Text>
            <Svg icon="eBridgeLogo" oblongSize={[pTd(47), pTd(12)]} />
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  eBridgeCardContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerContainer: {
    width: '100%',
  },
  commonButton: {
    marginTop: pTd(16),
  },
  tipContainer: {
    ...GStyles.paddingArg(pTd(16)),
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    flexDirection: 'row',
  },
  tipInfoMessage: {
    flex: 1,
    color: theme.colors.textBase2,
  },
  poweredWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pTd(16),
  },
  poweredText: {
    color: theme.colors.textBase3,
    fontSize: pTd(12),
    lineHeight: pTd(12),
    marginRight: pTd(4),
  },
}));
