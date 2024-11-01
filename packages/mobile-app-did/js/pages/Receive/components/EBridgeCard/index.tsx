import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import { makeStyles } from '@rneui/themed';
import TokenBalanceShow from 'components/TokenBalanceShow';
import TokenAmountInput from 'components/TokenAmountInput';
import CommonButton from 'components/CommonButton';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import WalletConnect from '../WalletConnect';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import useGetEBridgeConfig from 'hooks/ebridge';
import { TLimitData } from '@portkey-wallet/utils/eBridge/types';
import { ActionType } from 'types/common';

export interface IEBridgeCardProps {
  styleProps?: ViewStyle;
  tokenInfo: IUserTokenItemResponse;
  destinationChain: IChainItemType;
  sourceChain: TReceiveFromNetworkItem;
}

export default function EBridgeCard(props: IEBridgeCardProps) {
  const { styleProps, tokenInfo, destinationChain, sourceChain } = props;
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [usdValue, setUsdValue] = useState('');
  const [isExceed, setIsExceed] = useState(false);
  const styles = getStyles();
  const { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig } = useGetEBridgeConfig();
  const [fee, setFee] = useState('');
  const [limit, setLimit] = useState<TLimitData>();
  const eBridgeInstanceRef = useRef<EBridge>();
  const { isConnected } = useWalletConnectModal();
  const btnDisabled = useMemo(() => {
    return !(value || usdValue) || isExceed;
  }, [isExceed, usdValue, value]);
  const btnTitleText = useMemo(() => {
    if (isExceed) return `Insufficient ${tokenInfo.label || tokenInfo.symbol} balance`;
    return 'Preview';
  }, [isExceed, tokenInfo]);
  const onPressBtn = useCallback(() => {
    navigationService.navigate('ReceivePreview', {
      onPress: async () => {
        // await eBridgeInstanceRef.current?.createReceipt({
        // TODO
        // });
        navigationService.navigate('ReceiveFinishPage', {
          actionType: ActionType.RECEIVE,
        });
      },
    });
  }, []);

  const initEBridgeInstance = useCallback(async () => {
    const bridge = new EBridge({
      fromChainInfo: getEVMChainInfoConfig(sourceChain.network),
      toChainInfo: getAELFChainInfoConfig(destinationChain.chainId),
      tokenInfo: getTokenConfig(tokenInfo.symbol),
    });
    eBridgeInstanceRef.current = bridge;
    setFee(await bridge.getELFFee());
    setLimit(await bridge.getLimit());
  }, [
    destinationChain.chainId,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    sourceChain.network,
    tokenInfo.symbol,
  ]);

  useEffect(() => {
    if (isConnected && !eBridgeInstanceRef.current) {
      initEBridgeInstance();
    }
  }, [initEBridgeInstance, isConnected]);

  return (
    <View style={[styleProps, styles.eBridgeCardContainer]}>
      <View>
        {isConnected && (
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
        )}
        <TokenAmountInput
          value={value}
          usdValue={usdValue}
          symbol={tokenInfo.symbol}
          label={tokenInfo.label}
          decimals={tokenInfo.decimals ?? ''}
          warningTip={isExceed ? 'Exceeds available balance' : undefined}
          editable={isConnected}
          setUsdValue={v => {
            setUsdValue(v);
            // TODO exceed
          }}
          setValue={v => {
            setValue(v);
            // TODO exceed
          }}
          styleProps={{ marginTop: pTd(24) }}
        />
      </View>
      <View style={styles.footerContainer}>
        {isConnected ? (
          <CommonButton disabled={btnDisabled} type="primary" title={t(btnTitleText)} onPress={onPressBtn} />
        ) : (
          <>
            <View style={styles.tipContainer}>
              <Svg icon="info" iconStyle={{ marginRight: pTd(12) }} />
              <TextL style={styles.tipInfoMessage}>
                {t(
                  `To receive this token from the Ethereum network, connect to an external wallet and bridge the assets to your destination network.`,
                )}
              </TextL>
            </View>
            <WalletConnect />
            <View style={styles.poweredWrap}>
              <Text style={styles.poweredText}>Powered by</Text>
              <Svg icon="eBridgeLogo" oblongSize={[pTd(47), pTd(12)]} />
            </View>
          </>
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
