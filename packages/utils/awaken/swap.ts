import { TEN_THOUSAND, ZERO } from '@portkey-wallet/constants/misc';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { TSwapRoute } from '@portkey-wallet/types/types-ca/awaken/swap';
import BigNumber from 'bignumber.js';

export type TGetContractAmountOutParams = {
  contract: ContractBasic;
  amountIn: string;
  path: string[];
  feeRates: Array<string | number>;
};
export const getContractAmountOut = async ({
  contract,
  amountIn,
  path,
  feeRates,
}: TGetContractAmountOutParams): Promise<{ amount: string[] }> => {
  const rst = await contract.callViewMethod('GetAmountsOut', {
    amountIn,
    path,
    feeRates,
  });

  return rst.data;
};

export type TGetContractTotalAmountOutParams = {
  contract: ContractBasic;
  swapRoute: TSwapRoute;
};
export const getContractTotalAmountOut = async ({ contract, swapRoute }: TGetContractTotalAmountOutParams) => {
  const result = await Promise.all(
    swapRoute.distributions.map(item => {
      return getContractAmountOut({
        contract,
        amountIn: item.amountIn,
        path: item.tokens.map(token => token.symbol),
        feeRates: item.feeRates.map(fee => TEN_THOUSAND.times(fee).toNumber()),
      });
    }),
  );
  const amountOuts = result.map(item => item?.amount[item?.amount?.length - 1]);

  return {
    amountOuts,
    total: amountOuts.reduce((p, c) => p.plus(c), ZERO).toFixed(),
  };
};

export const getPriceImpactWithBuy = (
  reserveA: BigNumber,
  reserveB: BigNumber,
  total: BigNumber | string,
  output: BigNumber,
): BigNumber => {
  if (!reserveA || !reserveB || !total) return ZERO;

  const prePro = reserveB.div(reserveA);

  const bigTotal = new BigNumber(total);
  const numerator = reserveB.plus(bigTotal);
  const denominator = reserveA.minus(output);

  return numerator.div(denominator).minus(prePro).div(prePro).times(100);
};
