import React, { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonPreviewContainer from 'components/CommonPreviewContainer';
import Svg from 'components/Svg';
import CommonInfoRow from 'components/CommonInfoRow';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getChainSvgName } from 'utils';
import { pTd } from 'utils/unit';
import { getStyles } from './style';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TSwapInfo } from '../components/SwapEnter';
import {
  useAwakenGasFee,
  useAwakenTokenPrices,
  useAwakenUserSlippageTolerance,
} from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { TEN_THOUSAND, ZERO } from '@portkey-wallet/constants/misc';
import { bigNumberToString, minimumAmountOut } from '@portkey-wallet/utils/awaken';
import { getPriceImpactWithBuy } from '@portkey-wallet/utils/awaken/swap';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { TSwapRoute } from '@portkey-wallet/types/types-ca/awaken/swap';
import BigNumber from 'bignumber.js';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { SWAP_LABS_FEE_RATE, SWAP_RECEIVE_RATE } from '@portkey-wallet/constants/constants-ca/awaken/swap';

type TRouterParams = {
  swapInfo: TSwapInfo;
  swapRoute: TSwapRoute;
  priceLabel: string;
};
const SwapPreview = () => {
  const { swapInfo, swapRoute, priceLabel } = useRouterParams<TRouterParams>();

  const { t } = useLanguage();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(() => {
    setIsLoading(true);
  }, []);

  const { userSlippageTolerance } = useAwakenUserSlippageTolerance();

  const userSlippageToleranceStr = useMemo(
    () => `${ZERO.plus(userSlippageTolerance).times(100).toFixed()}%`,
    [userSlippageTolerance],
  );
  const amountOutMinValue = useMemo(() => {
    const { valueOut, tokenOut } = swapInfo;
    if (!valueOut || !tokenOut) return '-';
    const _value = bigNumberToString(
      minimumAmountOut(ZERO.plus(valueOut), userSlippageTolerance),
      Number(tokenOut.decimals),
    );
    return `${_value} ${formatNameWithNoUnderline(tokenOut.symbol)}`;
  }, [swapInfo, userSlippageTolerance]);

  const priceImpact = useMemo(() => {
    if (!swapRoute) return '-';

    const impactList: BigNumber[] = [];
    swapRoute.distributions.forEach(path => {
      for (let i = 0; i < path.tokens.length - 1; i++) {
        const tradePairExtension = path.tradePairExtensions[i];
        const tradePair = path.tradePairs[i];
        const tokenIn = path.tokens[i];
        const tokenOut = path.tokens[i + 1];
        let tokenInReserve = ZERO.plus(tradePairExtension.valueLocked0);
        let tokenOutReserve = ZERO.plus(tradePairExtension.valueLocked1);
        if (tokenIn.symbol !== tradePair.token0.symbol) {
          tokenInReserve = ZERO.plus(tradePairExtension.valueLocked1);
          tokenOutReserve = ZERO.plus(tradePairExtension.valueLocked0);
        }

        const valueIn = divDecimals(path.amounts[i], tokenIn.decimals);
        const valueOut = divDecimals(path.amounts[i + 1], tokenOut.decimals);

        const _impact = getPriceImpactWithBuy(tokenOutReserve, tokenInReserve, valueIn, valueOut);
        impactList.push(_impact);
      }
    });

    return `${bigNumberToString(BigNumber.max(...impactList), 2)}%`;
  }, [swapRoute]);

  const feeValue = useMemo(() => {
    if (!swapInfo.tokenOut) return '-';
    const _symbol = formatNameWithNoUnderline(swapInfo.tokenOut.symbol);
    if (!swapInfo.valueOut) return `- ${_symbol}`;

    return `${ZERO.plus(swapInfo.valueOut)
      .div(SWAP_RECEIVE_RATE)
      .times(SWAP_LABS_FEE_RATE)
      .div(TEN_THOUSAND)
      .dp(Number(swapInfo.tokenOut?.decimals || 1), BigNumber.ROUND_DOWN)
      .toFixed()} ${_symbol}`;
  }, [swapInfo]);

  const gasFee = useAwakenGasFee();
  const gasFeeValue = useMemo(() => {
    return `${divDecimals(ZERO.plus(gasFee), 8).toFixed()} ELF`;
  }, [gasFee]);

  return (
    <CommonPreviewContainer
      poweredIcon={<Svg icon="awakenLogo" oblongSize={[pTd(45), pTd(12)]} />}
      buttonProps={{ title: t('Swap'), onPress: handlePress }}
      isLoading={isLoading}>
      <View>
        <CommonInfoRow
          label={{ text: 'Network' }}
          value={{ text: 'aelf dAppChain', leftSvgName: getChainSvgName('tDVV') }}
        />
        <CommonInfoRow label={{ text: 'Price' }} value={{ text: priceLabel }} />
        <CommonInfoRow
          label={{
            text: 'Slippage tolerance',
            tooltipProps: {
              title: 'Slippage tolerance',
              description:
                'Slippage occurs when the price changes between placing and executing your order. If the change exceeds your set slippage tolerance, your trade will not proceed.',
            },
          }}
          value={{ text: userSlippageToleranceStr }}
        />
        <CommonInfoRow
          label={{
            text: 'Min to receive',
            tooltipProps: {
              title: 'Min to receive',
              description: 'The minimum amount you are guaranteed to receive based on your set slippage tolerance.',
            },
          }}
          value={{ text: amountOutMinValue, textBelow: isMainnet ? '$0.01' : '' }}
        />
        <CommonInfoRow
          label={{
            text: 'Price impact',
            tooltipProps: {
              title: 'Price impact',
              description: "The effect of your trade on the token's price.",
            },
          }}
          value={{ text: priceImpact }}
        />
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description:
                'Your transaction will execute within the maximum amount of slippage you define for this swap.',
            },
          }}
          value={{ text: 'Oct 1, 2024 at 12:23 am' }}
        />
        <CommonInfoRow
          label={{
            text: 'Transaction fee',
            tooltipProps: {
              title: 'Transaction fee',
              description: 'Fee applied by the decentralised exchange to ensure an optimal experience.',
              learnMoreUrl: 'https://awakenfinance.gitbook.io/en/ii.-trader-faq/what-is-a-swap-trade/what-is-the-fee',
            },
          }}
          value={{ text: feeValue, textBelow: isMainnet ? '$0.12' : '' }}
        />
        <CommonInfoRow
          label={{
            text: 'Network fee',
            tooltipProps: {
              title: 'Network fee',
              description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
            },
          }}
          value={{ text: gasFeeValue, textBelow: isMainnet ? '$0.01' : '' }}
        />
      </View>
      <CommonPromptCard
        style={styles.promptCard}
        type={PromptCardType.INFO}
        description={t(
          'Keep your wallet balance sufficient and avoid editing the authorization amount, or the transaction may fail.',
        )}
      />
    </CommonPreviewContainer>
  );
};

export default memo(SwapPreview);
