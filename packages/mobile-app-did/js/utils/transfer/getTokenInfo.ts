import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export const getTokenInfo = async ({
  tokenContract,
  paramsOption,
}: {
  tokenContract: ContractBasic;
  paramsOption: {
    symbol: string;
  };
}) => {
  const {
    data: { issueChainId },
  } = await tokenContract.callViewMethod('GetTokenInfo', paramsOption);
  if (typeof issueChainId !== 'number') throw Error('GetTokenInfo Error');
  return issueChainId;
};
