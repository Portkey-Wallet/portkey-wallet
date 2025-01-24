import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import CommonPreviewContainer from 'components/CommonPreviewContainer';
import Svg from 'components/Svg';
import CommonInfoRow from 'components/CommonInfoRow';
import PreviewAmountCard from '../components/PreviewAmountCard';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { getChainSvgName } from 'utils';
import { pTd } from 'utils/unit';
import { getStyles } from './style';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TSwapInfo } from '../components/SwapEnter';
import {
  useAwakenGasFee,
  useAwakenTokenPrices,
  useAwakenUserExpiration,
  useAwakenUserSlippageTolerance,
} from '@portkey-wallet/hooks/hooks-eoa/awaken/state';
import { LANG_MAX, ONE, TEN_THOUSAND, ZERO } from '@portkey-wallet/constants/misc';
import { bigNumberToString, getDeadline, minimumAmountOut } from '@portkey-wallet/utils/awaken';
import { getContractTotalAmountOut, getPriceImpactWithBuy, sendEOASwap } from '@portkey-wallet/utils/awaken/swap';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { TContractSwapToken, TSwapRoute } from '@portkey-wallet/types/awaken/swap';
import BigNumber from 'bignumber.js';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { SWAP_LABS_FEE_RATE, SWAP_RECEIVE_RATE, SWAP_TIME_INTERVAL } from '@portkey-wallet/constants/awaken/swap';
import { useDefaultTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { formatPriceUsd } from '@portkey-wallet/utils/format';
import { useReturnLastCallback } from '@portkey-wallet/hooks';
import { useGetSwapHookViewContract } from 'hooks/awaken';
import { useGetContract, useGetTokenContract, useGetTokenViewContract } from 'hooks/contract';
import { useDAppChainId } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { getAllowance } from '@portkey-wallet/utils/contract';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useSwapHookContractAddress } from '@portkey-wallet/hooks/hooks-eoa/awaken';
import { AWAKEN_DEFAULT_CID } from '@portkey-wallet/constants/awaken';
import navigationService from 'utils/navigationService';
import { ActionType } from 'types/common';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import { HELP_URL } from 'pages/Send/constant';

type TRouterParams = {
  swapInfo: TSwapInfo;
  swapRoute: TSwapRoute;
  priceLabel: string;
};
const SwapPreview = () => {
  const { swapInfo: swapInfoProp, swapRoute, priceLabel } = useRouterParams<TRouterParams>();
  const [swapInfo, setSwapInfo] = useState<TSwapInfo>(swapInfoProp);

  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const { userSlippageTolerance } = useAwakenUserSlippageTolerance();

  const userSlippageToleranceStr = useMemo(
    () => `${ZERO.plus(userSlippageTolerance).times(100).toFixed()}%`,
    [userSlippageTolerance],
  );
  const { price: tokenOutPrice } = useAwakenTokenPrices({ symbol: swapInfo.tokenOut?.symbol || '', isInit: false });

  const amountOutMin = useMemo(() => {
    const { valueOut, tokenOut } = swapInfo;
    if (!valueOut || !tokenOut) {
      return undefined;
    }
    return minimumAmountOut(ZERO.plus(valueOut), userSlippageTolerance).dp(tokenOut.decimals);
  }, [swapInfo, userSlippageTolerance]);

  const amountOutMinValue = useMemo(() => {
    const { tokenOut } = swapInfo;
    if (amountOutMin === undefined || !tokenOut) {
      return '-';
    }
    return `${amountOutMin.toFixed()} ${formatNameWithNoUnderline(tokenOut.symbol)}`;
  }, [amountOutMin, swapInfo]);

  const amountOutMinUsd = useMemo(() => {
    if (amountOutMin === undefined) {
      return '-';
    }
    return `$${formatPriceUsd(ZERO.plus(tokenOutPrice).times(amountOutMin))}`;
  }, [amountOutMin, tokenOutPrice]);

  const priceImpact = useMemo(() => {
    if (!swapRoute) {
      return '-';
    }

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
    const { valueOut } = swapInfo;
    if (!valueOut) {
      return undefined;
    }

    return ZERO.plus(swapInfo.valueOut)
      .div(SWAP_RECEIVE_RATE)
      .times(SWAP_LABS_FEE_RATE)
      .div(TEN_THOUSAND)
      .dp(Number(swapInfo.tokenOut?.decimals || 1), BigNumber.ROUND_DOWN)
      .toFixed();
  }, [swapInfo]);
  const feeValueStr = useMemo(() => {
    if (!swapInfo.tokenOut) {
      return '-';
    }
    const _symbol = formatNameWithNoUnderline(swapInfo.tokenOut.symbol);
    if (feeValue === undefined) {
      return `- ${_symbol}`;
    }

    return `${feeValue} ${_symbol}`;
  }, [feeValue, swapInfo.tokenOut]);
  const feeUsd = useMemo(() => {
    const value = ZERO.plus(tokenOutPrice).times(feeValue || 0);
    return `$${formatPriceUsd(value)}`;
  }, [feeValue, tokenOutPrice]);

  const gasFee = useAwakenGasFee();
  const gasFeeValue = useMemo(() => {
    return `${divDecimals(ZERO.plus(gasFee), 8).toFixed()} ELF`;
  }, [gasFee]);

  const defaultTokenPrice = useDefaultTokenPrice();
  const gasFeeUsd = useMemo(() => {
    return `$${formatPriceUsd(divDecimals(ZERO.plus(gasFee), 8).times(defaultTokenPrice))}`;
  }, [defaultTokenPrice, gasFee]);

  const getValueOut = useReturnLastCallback(getContractTotalAmountOut, []);

  const getSwapHookViewContract = useGetSwapHookViewContract();

  const executeCb = useCallback(async () => {
    if (!swapInfo || !swapRoute) {
      return;
    }
    const { tokenOut } = swapInfo;
    if (!tokenOut) {
      return;
    }

    try {
      const routeContract = await getSwapHookViewContract();
      const { amountOuts, total: amountOutAmount } = await getValueOut({
        contract: routeContract,
        swapRoute,
      });

      console.log('SwapPreview amountOutValue', amountOutAmount);

      const amountOutValue = divDecimals(
        ZERO.plus(amountOutAmount).times(SWAP_RECEIVE_RATE).dp(0, BigNumber.ROUND_CEIL),
        tokenOut.decimals,
      ).toFixed();

      setSwapInfo(pre => {
        if (!pre) {
          return pre;
        }
        return {
          ...pre,
          valueOut: amountOutValue,
        };
      });
      const _swapRoute: TSwapRoute = JSON.parse(JSON.stringify(swapRoute));
      _swapRoute.distributions.forEach((path, idx) => {
        path.amountOut = amountOuts[idx];
      });
      console.log('_swapRoute', _swapRoute);

      return {
        amountOutValue,
        amountOutAmount,
        swapRoute: _swapRoute,
      };
    } catch (error) {
      console.log('SwapPreview executeCb error:', error);
      return;
    }
  }, [getSwapHookViewContract, getValueOut, swapInfo, swapRoute]);
  const executeCbRef = useRef(executeCb);
  executeCbRef.current = executeCb;

  const timerRef = useRef<NodeJS.Timeout>();
  const clearTimer = useCallback(() => {
    if (!timerRef.current) {
      return;
    }
    clearInterval(timerRef.current);
    console.log('SwapPreview: clearTimer');
  }, []);

  const registerTimer = useCallback(() => {
    clearTimer();
    console.log('SwapPreview: registerTimer');

    executeCbRef.current();
    timerRef.current = setInterval(() => {
      executeCbRef.current();
    }, SWAP_TIME_INTERVAL);
  }, [clearTimer]);

  useEffect(() => {
    registerTimer();
    return () => {
      clearTimer();
    };
  }, [clearTimer, registerTimer]);

  const [isSwapping, setIsSwapping] = useState(false);

  const swapHookContractAddress = useSwapHookContractAddress();
  const getTokenViewContract = useGetTokenViewContract();
  const getTokenContract = useGetTokenContract();
  const getContract = useGetContract();
  const dAppChainId = useDAppChainId();
  const account = useCurrentAccount();
  const { userExpiration } = useAwakenUserExpiration();

  const handlePress = useCallback(async () => {
    if (!swapInfo) {
      return;
    }

    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut || !valueIn || !valueOut) {
      return;
    }
    const accountAddress = account?.address || '';

    setIsSwapping(true);
    try {
      const tokenViewContract = await getTokenViewContract(dAppChainId);

      const valueInAmountBN = timesDecimals(valueIn, tokenIn.decimals);
      const allowance = await getAllowance(tokenViewContract, {
        symbol: tokenIn.symbol,
        owner: accountAddress,
        spender: swapHookContractAddress,
      });

      const tokenContract = await getTokenContract(dAppChainId);
      if (valueInAmountBN.gt(allowance)) {
        console.log('allowance', allowance);
        const approveResult = await tokenContract.callSendMethod('Approve', accountAddress, {
          spender: swapHookContractAddress,
          symbol: tokenIn.symbol,
          amount: LANG_MAX.toFixed(),
        });
        if (approveResult?.error) {
          throw approveResult?.error;
        }
      }

      const valueOutAmountBN = timesDecimals(valueOut, tokenOut.decimals);

      const result = await executeCbRef.current();
      if (!result) {
        return;
      }
      const _swapRoute = result.swapRoute;
      const amountOutAmount = result.amountOutAmount;

      const amountMinOutAmountBN = BigNumber.max(
        minimumAmountOut(valueOutAmountBN, userSlippageTolerance).dp(0, BigNumber.ROUND_DOWN),
        ONE,
      );
      if (amountMinOutAmountBN.gt(amountOutAmount)) {
        ActionSheet.alert({
          showInfoIcon: true,
          title: 'Price change alert',
          message: 'The swap price has changed. Please re-initiate the transaction to continue.',
          buttons: [
            {
              title: 'OK',
              type: 'primary',
            },
          ],
        });
        return;
      }

      const deadline = getDeadline(userExpiration);
      const channel = AWAKEN_DEFAULT_CID;
      const swapTokens: TContractSwapToken[] = _swapRoute.distributions.map(item => {
        const amountOutMinBN = BigNumber.max(
          minimumAmountOut(ZERO.plus(item.amountOut), userSlippageTolerance).dp(0, BigNumber.ROUND_DOWN),
          ONE,
        );
        const _amountOutMin = amountOutMinBN.lt(1) ? '1' : amountOutMinBN.toFixed();

        return {
          amountIn: item.amountIn,
          amountOutMin: _amountOutMin,
          channel,
          deadline,
          path: item.tokens.map(token => token.symbol),
          to: accountAddress,
          feeRates: item.feeRates.map(fee => ZERO.plus(TEN_THOUSAND).times(fee).toNumber()),
        };
      });

      const contract = await getContract(dAppChainId, swapHookContractAddress);
      const req = await sendEOASwap({
        contract,
        address: accountAddress,
        args: {
          swapTokens,
          labsFeeRate: SWAP_LABS_FEE_RATE,
        },
      });
      if (req?.error) {
        throw req?.error;
      }
      console.log('req', req);

      navigationService.navigate('SwapFinishPage', {
        actionType: ActionType.SWAP,
      });
    } catch (error) {
      console.log('SwapPreview onSwap error', error);
      CommonToast.fail('Failed to create swap order. Please try again.');
    } finally {
      console.log('onSwap finally');
      setIsSwapping(false);
    }
  }, [
    account?.address,
    dAppChainId,
    getContract,
    getTokenContract,
    getTokenViewContract,
    swapHookContractAddress,
    swapInfo,
    userExpiration,
    userSlippageTolerance,
  ]);

  return (
    <CommonPreviewContainer
      footerStyle={styles.footerWrap}
      poweredIcon={<Svg icon="awakenLogo" oblongSize={[pTd(45), pTd(12)]} />}
      buttonProps={{ title: 'Swap', onPress: handlePress }}
      isLoading={isSwapping}
      helpUrl={HELP_URL}>
      <PreviewAmountCard
        style={styles.previewAmountCard}
        tokenIn={swapInfo.tokenIn}
        tokenOut={swapInfo.tokenOut}
        valueIn={swapInfo.valueIn}
        valueOut={swapInfo.valueOut}
      />
      <View style={styles.infoRowContainer}>
        <CommonInfoRow
          label={{ text: 'Network' }}
          value={{ text: 'aelf dAppChain', leftSvgName: getChainSvgName('tDVV') }}
          isLabelNoTail={true}
        />
        <CommonInfoRow label={{ text: 'Price' }} value={{ text: priceLabel }} isLabelNoTail={true} />
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
          isLabelNoTail={true}
        />
        <CommonInfoRow
          label={{
            text: 'Min to receive',
            tooltipProps: {
              title: 'Min to receive',
              description: 'The minimum amount you are guaranteed to receive based on your set slippage tolerance.',
            },
          }}
          value={{ text: amountOutMinValue, textBelow: isMainnet ? amountOutMinUsd : '' }}
          isLabelNoTail={true}
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
          isLabelNoTail={true}
        />
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description: "Your trade will be cancelled if it's not completed within the set timeframe.",
            },
          }}
          value={{ text: `${userExpiration} minutes` }}
          isLabelNoTail={true}
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
          value={{ text: feeValueStr, textBelow: isMainnet ? feeUsd : '' }}
          isLabelNoTail={true}
        />
        <CommonInfoRow
          label={{
            text: 'Network fee',
            tooltipProps: {
              title: 'Network fee',
              description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
            },
          }}
          value={{ text: gasFeeValue, textBelow: isMainnet ? gasFeeUsd : '' }}
          isLabelNoTail={true}
        />
      </View>
    </CommonPreviewContainer>
  );
};

export default memo(SwapPreview);
