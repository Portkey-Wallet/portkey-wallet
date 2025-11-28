import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export const crossChainTransferToCa = ({
  contract,
  paramsOption,
  sendOptions,
}: {
  contract: ContractBasic;
  paramsOption: {
    issueChainId: string | number;
    toChainId: string;
    symbol: string;
    to: string;
    amount: string | number;
    memo?: string;
  };
  sendOptions?: SendOptions;
}) => {
  return contract.callSendMethod('CrossChainTransfer', '', paramsOption, sendOptions);
};
