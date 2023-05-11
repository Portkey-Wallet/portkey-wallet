import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export const crossChainTransferToCa = ({
  contract,
  paramsOption,
  sendOptions,
}: {
  contract: ContractBasic;
  paramsOption: {
    issueChainId: string;
    toChainId: string;
    symbol: string;
    to: string;
    amount: number;
    memo?: string;
  };
  sendOptions?: SendOptions;
}) => {
  return contract.callSendMethod('CrossChainTransfer', '', paramsOption, sendOptions);
};
