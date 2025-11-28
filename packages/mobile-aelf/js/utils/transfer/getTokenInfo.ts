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
  const req = await tokenContract.callViewMethod('GetTokenInfo', paramsOption);
  if (req?.error) throw req.error;
  return req?.data;
};

export const getTokenIssueChainId = async ({
  tokenContract,
  paramsOption,
}: {
  tokenContract: ContractBasic;
  paramsOption: {
    symbol: string;
  };
}) => {
  const tokenInfo = await getTokenInfo({ tokenContract, paramsOption });
  const { issueChainId } = tokenInfo || {};
  if (typeof issueChainId !== 'number') throw Error('GetTokenInfo Error');
  return issueChainId;
};
