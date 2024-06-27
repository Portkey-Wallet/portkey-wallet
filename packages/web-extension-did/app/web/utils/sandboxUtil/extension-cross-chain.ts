import CrossTransfer from '@portkey-wallet/utils/withdraw';
import { IWithdrawParams } from '@portkey-wallet/utils/withdraw/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export class CrossTransferExtension extends CrossTransfer {
  constructor() {
    super();
  }

  withdraw = async (params: Omit<IWithdrawParams, 'tokenContract' | 'portkeyContract'>) => {
    const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.etransferCrossTransfer, {
      chainType: 'aelf',
      rpcUrl: '',
      options: JSON.stringify(this.options),
      params: JSON.stringify(params),
    });

    if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
    return {
      code: resMessage.code,
      result: {
        // rpcUrl,
        message: resMessage.message,
      },
    } as any;
  };
}
