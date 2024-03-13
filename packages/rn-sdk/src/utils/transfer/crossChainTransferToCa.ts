import { SendOptions } from 'packages/contracts/types';
import { ContractBasic } from 'packages/utils/contract';

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
