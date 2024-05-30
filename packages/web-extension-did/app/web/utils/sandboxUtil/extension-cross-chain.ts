import CrossTransfer from '@portkey-wallet/utils/withdraw';
import { IWithdrawParams } from '@portkey-wallet/utils/withdraw/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export class CrossTransferExtension extends CrossTransfer {
  constructor() {
    super();
  }

  async withdraw(params: IWithdrawParams) {
    const rpcUrl = this.options.chainInfo.endPoint;
    const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.etransferCrossTransfer, {
      chainType: 'aelf',
      rpcUrl,
      options: this.options,
      params,
    });

    console.log(resMessage, 'resMessage===ManagerForwardCall');

    if (resMessage.code === SandboxErrorCode.error) throw resMessage.error.message;
    return {
      code: resMessage.code,
      result: {
        rpcUrl,
        message: resMessage.message,
      },
    } as any;
  }
}
