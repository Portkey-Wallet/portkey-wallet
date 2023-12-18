import AElf from 'aelf-sdk';
import { TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

const privateKey1 = '96ab8ea91edbd17f80049daaa92949c1ef2356f1215fbc252e044c7b0b5a3e13';
const wallet1 = AElf.wallet.getWalletByPrivateKey(privateKey1);

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

export const getTokenContract = async (rpcUrl: string, tokenAddress: string, wallet: any = wallet1) => {
  if (!rpcUrl) return;
  const aelf = new AElf(new AElf.providers.HttpProvider(rpcUrl));
  return await aelf.chain.contractAt(tokenAddress, wallet);
};
