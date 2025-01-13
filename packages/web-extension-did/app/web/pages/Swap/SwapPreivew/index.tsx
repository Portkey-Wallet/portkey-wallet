import { TSwapInfo } from '../SwapForm';
import { TContractSwapToken, TSwapRoute } from '@portkey-wallet/types/types-ca/awaken/swap';
import './index.less';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  useAwakenGasFee,
  useAwakenTokenPrices,
  useAwakenUserExpiration,
  useAwakenUserSlippageTolerance,
} from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { LANG_MAX, ONE, TEN_THOUSAND, ZERO } from '@portkey-wallet/constants/misc';
import { bigNumberToString, getDeadline, minimumAmountOut } from '@portkey-wallet/utils/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { formatPriceUsd } from '@portkey-wallet/utils/format';
import BigNumber from 'bignumber.js';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { getContractTotalAmountOut, getPriceImpactWithBuy, sendSwap } from '@portkey-wallet/utils/awaken/swap';
import {
  SWAP_LABS_FEE_RATE,
  SWAP_RECEIVE_RATE,
  SWAP_TIME_INTERVAL,
} from '@portkey-wallet/constants/constants-ca/awaken/swap';
import { useDefaultTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useReturnLastCallback } from '@portkey-wallet/hooks';
import { useGetSwapHookViewContract } from 'hooks/awaken';
import { useSwapHookContractAddress } from '@portkey-wallet/hooks/hooks-ca/awaken';
import { useDAppChainId } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getAllowance } from '@portkey-wallet/utils/contract';
import { AWAKEN_DEFAULT_CID } from '@portkey-wallet/constants/constants-ca/awaken';
import { useGetCAContract, useGetTokenViewContract } from 'hooks/contract';
import { CurrencyItem } from '../components/CurrencyItem';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { CommonInfoRow } from 'pages/components/CommonInfoRow';
import { Button } from 'antd';
import { CommonModal, singleMessage } from '@portkey/did-ui-react';

export type TSwapPreviewProps = {
  swapInfo: TSwapInfo;
  swapRoute: TSwapRoute;
  priceLabel: string;
  onFinish?: () => void;
};

export const SwapPreview = ({ swapInfo: swapInfoProp, swapRoute, priceLabel, onFinish }: TSwapPreviewProps) => {
  const [swapInfo, setSwapInfo] = useState<TSwapInfo>(swapInfoProp);

  const isMainnet = useIsMainnet();

  const { userSlippageTolerance } = useAwakenUserSlippageTolerance();

  const userSlippageToleranceStr = useMemo(
    () => `${ZERO.plus(userSlippageTolerance).times(100).toFixed()}%`,
    [userSlippageTolerance],
  );

  const { price: tokenInPrice } = useAwakenTokenPrices({
    symbol: swapInfo.tokenIn?.symbol || '',
    isInit: false,
  });
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
    swapRoute.distributions.forEach((path) => {
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

      setSwapInfo((pre) => {
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
  const getCAContract = useGetCAContract();
  const dAppChainId = useDAppChainId();
  const wallet = useCurrentWalletInfo();
  const { userExpiration } = useAwakenUserExpiration();

  const [isPriceTipShow, setIsPriceTipShow] = useState(false);
  const handlePress = useCallback(async () => {
    if (!swapInfo) {
      return;
    }

    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut || !valueIn || !valueOut) {
      return;
    }
    const caAddress = wallet[dAppChainId]?.caAddress || '';

    setIsSwapping(true);
    try {
      const tokenViewContract = getTokenViewContract(dAppChainId);

      const valueInAmountBN = timesDecimals(valueIn, tokenIn.decimals);
      const allowance = await getAllowance(tokenViewContract, {
        symbol: tokenIn.symbol,
        owner: caAddress,
        spender: swapHookContractAddress,
      });

      const caContract = await getCAContract(dAppChainId);
      if (valueInAmountBN.gt(allowance)) {
        console.log('allowance', allowance);
        const approveResult = await caContract.callSendMethod('ManagerApprove', wallet.address, {
          caHash: wallet.caHash,
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
        setIsPriceTipShow(true);
        return;
      }

      const deadline = getDeadline(userExpiration);
      const channel = AWAKEN_DEFAULT_CID;
      const swapTokens: TContractSwapToken[] = _swapRoute.distributions.map((item) => {
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
          path: item.tokens.map((token) => token.symbol),
          to: caAddress,
          feeRates: item.feeRates.map((fee) => ZERO.plus(TEN_THOUSAND).times(fee).toNumber()),
        };
      });

      const req = await sendSwap({
        contract: caContract,
        managerAddress: wallet.address,
        caHash: wallet.caHash || '',
        contractAddress: swapHookContractAddress,
        args: {
          swapTokens,
          labsFeeRate: SWAP_LABS_FEE_RATE,
        },
      });
      if (req?.error) {
        throw req?.error;
      }
      console.log('req', req);

      onFinish?.();
    } catch (error) {
      console.log('SwapPreview onSwap error', error);
      singleMessage.error('Failed to create swap order. Please try again.');
    } finally {
      console.log('onSwap finally');
      setIsSwapping(false);
    }
  }, [
    dAppChainId,
    getCAContract,
    getTokenViewContract,
    onFinish,
    swapHookContractAddress,
    swapInfo,
    userExpiration,
    userSlippageTolerance,
    wallet,
  ]);

  const valueInUsd = useMemo(() => {
    if (!swapInfo.valueIn) return '';
    return `${formatPriceUsd(ZERO.plus(swapInfo.valueIn).times(tokenInPrice))}`;
  }, [swapInfo.valueIn, tokenInPrice]);

  const valueOutUsd = useMemo(() => {
    if (!swapInfo.valueOut) return '';
    return `${formatPriceUsd(ZERO.plus(swapInfo.valueOut).times(tokenOutPrice))}`;
  }, [swapInfo.valueOut, tokenOutPrice]);

  return (
    <div className="swap-preview">
      <div className="swap-preview-body">
        {swapInfo.tokenIn && swapInfo.tokenOut && (
          <div className="swap-preview-token-card">
            <CurrencyItem
              item={swapInfo.tokenIn}
              isChainNameShow={false}
              balance={swapInfo.valueIn}
              balanceInUsd={valueInUsd}
            />

            <CustomSvgV3 className="swap-preview-token-card-icon" type="arrow down thin" />

            <CurrencyItem
              item={swapInfo.tokenOut}
              isChainNameShow={false}
              balance={swapInfo.valueOut}
              balanceInUsd={valueOutUsd}
            />
          </div>
        )}

        <div>
          <CommonInfoRow
            label={{ text: 'Network' }}
            value={{ text: 'aelf dAppChain', leftSvgName: 'Chain=AELF Side' }}
          />

          <CommonInfoRow label={{ text: 'Price' }} value={{ text: priceLabel }} />

          <CommonInfoRow
            label={{
              text: 'Slippage tolerance',
              tooltipProps: {
                title: 'Slippage tolerance',
                content:
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
                content: 'The minimum amount you are guaranteed to receive based on your set slippage tolerance.',
              },
            }}
            value={{ text: amountOutMinValue, textBelow: isMainnet ? amountOutMinUsd : '' }}
          />

          <CommonInfoRow
            label={{
              text: 'Price impact',
              tooltipProps: {
                title: 'Price impact',
                content: "The effect of your trade on the token's price.",
              },
            }}
            value={{ text: priceImpact }}
          />

          <CommonInfoRow
            label={{
              text: 'Expires by',
              tooltipProps: {
                title: 'Expires by',
                content: "Your trade will be cancelled if it's not completed within the set timeframe.",
              },
            }}
            value={{ text: `${userExpiration} minutes` }}
          />

          <CommonInfoRow
            label={{
              text: 'Transaction fee',
              tooltipProps: {
                title: 'Transaction fee',
                content: (
                  <>
                    {'Fee applied by the decentralised exchange to ensure an optimal experience.'}
                    <a
                      className="swap-preview-tip-link"
                      href="https://awakenfinance.gitbook.io/en/ii.-trader-faq/what-is-a-swap-trade/what-is-the-fee"
                      target="_blank"
                      rel="noopener noreferrer">
                      Learn more
                    </a>
                    {'.'}
                  </>
                ) as unknown as string,
              },
            }}
            value={{ text: feeValueStr, textBelow: isMainnet ? feeUsd : '' }}
          />

          <CommonInfoRow
            label={{
              text: 'Network fee',
              tooltipProps: {
                title: 'Network fee',
                content: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
              },
            }}
            value={{ text: gasFeeValue, textBelow: isMainnet ? gasFeeUsd : '' }}
          />
        </div>

        <div className="swap-preview-image-wrap">
          <img src="assets/images/powered_by_awaken.png" className="swap-preview-image" />
        </div>
      </div>

      <div className="swap-preview-footer">
        <Button loading={isSwapping} type="primary" onClick={handlePress}>
          Swap
        </Button>
      </div>

      <CommonModal
        className="swap-preview-price-tip-modal"
        open={isPriceTipShow}
        onClose={() => {
          setIsPriceTipShow(false);
        }}>
        <div className="swap-preview-price-tip-body">
          <div className="swap-preview-price-tip-content">
            <CustomSvgV3 className="swap-preview-price-tip-icon" type="error" />
            <div className="swap-preview-price-tip-title">Price change alert</div>
            <div className="swap-preview-price-tip-sub-title">
              The swap price has changed. Please re-initiate the transaction to continue.
            </div>
          </div>

          <Button type="primary" className="swap-preview-price-tip-button" onClick={() => setIsPriceTipShow(false)}>
            OK
          </Button>
        </div>
      </CommonModal>
    </div>
  );
};
