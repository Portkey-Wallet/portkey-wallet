import AElf from 'aelf-sdk';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getDefaultWallet } from '@portkey-wallet/utils/aelfUtils';
import { AElfWallet } from '@portkey-wallet/types/aelf';

export const getELFChainBalance = async (tokenContract: any, symbol: string, owner: string): Promise<string> => {
  let balance;
  if (tokenContract instanceof ContractBasic) {
    const req = await tokenContract.callViewMethod('GetBalance', {
      symbol,
      owner,
    });
    if (!req.error) {
      balance = req.data;
    }
  } else {
    balance = await tokenContract.GetBalance.call({
      symbol,
      owner,
    });
  }
  return balance?.balance ?? balance?.amount ?? '0';
};

export const getTokenContract = async (
  rpcUrl: string,
  tokenAddress: string,
  wallet: AElfWallet = getDefaultWallet(),
) => {
  if (!rpcUrl) return;
  const aelf = new AElf(new AElf.providers.HttpProvider(rpcUrl));
  return await aelf.chain.contractAt(tokenAddress, wallet);
};
