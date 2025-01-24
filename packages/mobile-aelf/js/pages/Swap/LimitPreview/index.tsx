import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonPreviewContainer from 'components/CommonPreviewContainer';
import Svg from 'components/Svg';
import CommonInfoRow from 'components/CommonInfoRow';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import PreviewAmountCard from '../components/PreviewAmountCard';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { getChainSvgName } from 'utils';
import { pTd } from 'utils/unit';
import { getStyles } from './style';
import { TCurrency } from '@portkey-wallet/types/awaken';
import {
  LIMIT_LABS_FEE_RATE,
  LIMIT_PRICE_DECIMAL,
  LIMIT_RECEIVE_RATE,
  LimitExpiryEnum,
} from '@portkey-wallet/constants/awaken/limit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useAwakenGasFee, useAwakenTokenPrices } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';
import moment from 'moment';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { LANG_MAX, TEN_THOUSAND, ZERO } from '@portkey-wallet/constants/misc';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import BigNumber from 'bignumber.js';
import { useGetContract, useGetTokenContract, useGetTokenViewContract } from 'hooks/contract';
import { useDAppChainId } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { getAllowance } from '@portkey-wallet/utils/contract';
import { useLimitContractAddress } from '@portkey-wallet/hooks/hooks-eoa/awaken';
import { getDeadlineWithSec } from '@portkey-wallet/utils/awaken';
import { formatPriceUsd } from '@portkey-wallet/utils/format';
import { useDefaultTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { sendEOALimit } from '@portkey-wallet/utils/awaken/limit';
import navigationService from 'utils/navigationService';
import { ActionType } from 'types/common';
import CommonToast from 'components/CommonToast';
import { HELP_URL } from 'pages/Send/constant';

type TRouterParams = {
  tokenIn: TCurrency;
  tokenOut: TCurrency;
  valueIn: string;
  valueOut: string;
  expiryValue: LimitExpiryEnum;
  unfilledValue: string;
  unfilledCount: number;
  isPriceReverse?: boolean;
};

const SwapPreview = () => {
  const { t } = useLanguage();
  const styles = getStyles();
  const { tokenIn, tokenOut, valueIn, valueOut, expiryValue, unfilledValue } = useRouterParams<TRouterParams>();

  const isMainnet = useIsMainnet();

  const { price: tokenOutPrice } = useAwakenTokenPrices({ symbol: tokenOut.symbol });

  const requireApproveAmount = useMemo(() => {
    const remainAmountBN = divDecimals(unfilledValue, tokenIn.decimals);
    return remainAmountBN.plus(valueIn).toFixed();
  }, [valueIn, tokenIn.decimals, unfilledValue]);

  const price = useMemo(() => {
    return `1 ${formatNameWithNoUnderline(tokenIn.symbol)} = ${ZERO.plus(valueOut)
      .div(LIMIT_RECEIVE_RATE)
      .div(valueIn || 1)
      .dp(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_FLOOR)
      .toFixed()} ${formatNameWithNoUnderline(tokenOut.symbol)}`;
  }, [valueIn, valueOut, tokenIn.symbol, tokenOut.symbol]);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const getTokenContract = useGetTokenContract();
  const getContract = useGetContract();
  const getTokenViewContract = useGetTokenViewContract();
  const dAppChainId = useDAppChainId();
  const account = useCurrentAccount();
  const limitContractAddress = useLimitContractAddress();
  const handlePress = useCallback(async () => {
    if (!requireApproveAmount) {
      return;
    }
    setIsLoading(true);
    isLoadingRef.current = true;

    const accountAddress = account?.address || '';
    try {
      // const maxBufferPrice = await getContractMaxBufferPrice({
      //   contract: hookContract,
      //   tokenIn,
      //   tokenOut,
      // });

      // const curPrice = ZERO.plus(valueIn).div(valueOut);

      // console.log('maxBufferPrice', maxBufferPrice, curPrice.toFixed());
      // if (curPrice.gt(maxBufferPrice)) {
      //   onPriceError?.();
      //   setIsLoading(false);
      //   isLoadingRef.current = false;
      //   notification.error({
      //     message: '',
      //     description: t('limitPriceError'),
      //   });
      //   onCancel();
      //   return;
      // }
      const tokenViewContract = await getTokenViewContract(dAppChainId);
      const valueInAmountBN = timesDecimals(requireApproveAmount, tokenIn.decimals);

      const allowance = await getAllowance(tokenViewContract, {
        symbol: tokenIn.symbol,
        owner: accountAddress,
        spender: limitContractAddress,
      });

      const tokenContract = await getTokenContract(dAppChainId);
      if (valueInAmountBN.gt(allowance)) {
        console.log('allowance', allowance);
        const approveResult = await tokenContract.callSendMethod('Approve', accountAddress, {
          spender: limitContractAddress,
          symbol: tokenIn.symbol,
          amount: LANG_MAX.toFixed(),
        });
        if (approveResult?.error) {
          throw approveResult?.error;
        }
      }

      const realAmountOutBN = timesDecimals(valueOut, tokenOut.decimals)
        .div(LIMIT_RECEIVE_RATE)
        .dp(0, BigNumber.ROUND_DOWN);
      const args = {
        amountIn: timesDecimals(valueIn, tokenIn.decimals).toFixed(),
        symbolIn: tokenIn.symbol,
        amountOut: realAmountOutBN.toFixed(),
        symbolOut: tokenOut.symbol,
        deadline: getDeadlineWithSec(moment().add(expiryValue, 'days').unix()),
        labsFeeRate: LIMIT_LABS_FEE_RATE,
      };
      console.log('commitLimit', args);
      // const req = await commitLimit({
      //   contract: limitContract,
      //   account,
      //   t,
      //   args,
      // });
      // if (req !== REQ_CODE.UserDenied) {
      //   isLoadingRef.current = false;
      //   onSuccess?.();
      //   onCancel();
      //   return true;
      // }
      const contract = await getContract(dAppChainId, limitContractAddress);
      const req = await sendEOALimit({
        contract,
        address: accountAddress,
        args,
      });
      if (req?.error) {
        throw req?.error;
      }

      navigationService.navigate('SwapFinishPage', {
        actionType: ActionType.LIMIT,
      });
    } catch (error) {
      console.log('LimitConfirmModal error', error);
      CommonToast.fail('Failed to create limit order. Please try again.');
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [
    requireApproveAmount,
    account?.address,
    getTokenViewContract,
    dAppChainId,
    tokenIn.decimals,
    tokenIn.symbol,
    limitContractAddress,
    getTokenContract,
    valueOut,
    tokenOut.decimals,
    tokenOut.symbol,
    valueIn,
    expiryValue,
    getContract,
  ]);

  const limitFeeBN = useMemo(() => {
    if (!valueOut || !tokenOut) {
      return undefined;
    }

    return ZERO.plus(valueOut)
      .div(LIMIT_RECEIVE_RATE)
      .times(LIMIT_LABS_FEE_RATE)
      .div(TEN_THOUSAND)
      .dp(tokenOut.decimals || 1, BigNumber.ROUND_DOWN);
  }, [valueOut, tokenOut]);

  const limitFeeStr = useMemo(() => {
    if (!limitFeeBN) {
      return '-';
    }

    return `${limitFeeBN.toFixed()} ${formatNameWithNoUnderline(tokenOut.symbol)}`;
  }, [limitFeeBN, tokenOut.symbol]);

  const limitFeeUsd = useMemo(() => {
    if (!limitFeeBN) {
      return '-';
    }
    const value = ZERO.plus(tokenOutPrice).times(limitFeeBN);
    return `$${formatPriceUsd(value)}`;
  }, [limitFeeBN, tokenOutPrice]);

  const gasFee = useAwakenGasFee();
  const gasFeeValue = useMemo(() => {
    return `${divDecimals(ZERO.plus(gasFee), 8).toFixed()} ELF`;
  }, [gasFee]);

  const defaultTokenPrice = useDefaultTokenPrice();
  const gasFeeUsd = useMemo(() => {
    return `$${formatPriceUsd(divDecimals(ZERO.plus(gasFee), 8).times(defaultTokenPrice))}`;
  }, [defaultTokenPrice, gasFee]);

  return (
    <CommonPreviewContainer
      footerStyle={styles.footerWrap}
      poweredIcon={<Svg icon="awakenLogo" oblongSize={[pTd(45), pTd(12)]} />}
      buttonProps={{ title: t('Place limit order'), onPress: handlePress }}
      isLoading={isLoading}
      helpUrl={HELP_URL}>
      <PreviewAmountCard
        style={styles.previewAmountCard}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        valueIn={valueIn}
        valueOut={valueOut}
      />
      <View style={styles.infoRowContainer}>
        <CommonInfoRow
          label={{ text: 'Network' }}
          value={{ text: 'aelf dAppChain', leftSvgName: getChainSvgName('tDVV') }}
          isLabelNoTail={true}
        />
        <CommonInfoRow label={{ text: 'Limit price' }} value={{ text: price }} isLabelNoTail={true} />
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description: "Your trade will be cancelled if it's not completed within the set timeframe.",
            },
          }}
          value={{ text: `${expiryValue} day` }}
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
          value={{ text: limitFeeStr, textBelow: isMainnet ? limitFeeUsd : '' }}
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
