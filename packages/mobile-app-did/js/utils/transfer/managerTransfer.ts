import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export const managerTransfer = ({
  contract,
  paramsOption,
  sendOptions,
}: {
  contract: ContractBasic;
  sendOptions?: SendOptions;
  paramsOption: { caHash: string; symbol: string; to: string; amount: number | string; memo?: string };
}) => {
  return contract.callSendMethod('ManagerTransfer', '', paramsOption, sendOptions);
};
