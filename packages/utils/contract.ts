import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

type GetAllowanceParams = {
  symbol: string;
  owner: string;
  spender: string;
};

type GetAvailableAllowanceParams = GetAllowanceParams;

export async function getAllowance(tokenContract: ContractBasic, params: GetAllowanceParams) {
  const req = await tokenContract.callViewMethod('GetAllowance', params);
  if (req.error) throw req.error;
  return req.data.allowance;
}

export async function getAvailableAllowance(tokenContract: ContractBasic, params: GetAvailableAllowanceParams) {
  const req = await tokenContract.callViewMethod('GetAvailableAllowance', params);
  if (req.error) throw req.error;
  return req.data.allowance;
}
