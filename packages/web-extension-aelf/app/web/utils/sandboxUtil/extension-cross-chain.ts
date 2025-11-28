import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { EBridge, TEBridgeOptions } from '@portkey-wallet/utils/eBridgeEOA';
import { ICreateReceiptParams } from '@portkey-wallet/utils/eBridgeEOA/types/bridge';
import CrossTransfer from '@portkey-wallet/utils/withdrawEOA';
import { IWithdrawParams } from '@portkey-wallet/utils/withdrawEOA/types';
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

export class CrossEBridgeExtension extends EBridge {
  public pin: string;
  public wallet: TAccountInfo;
  public chainInfo: IChainItemType;
  constructor(options: TEBridgeOptions, pin: string, wallet: TAccountInfo, chainInfo: IChainItemType) {
    super(options);
    this.pin = pin;
    this.wallet = wallet;
    this.chainInfo = chainInfo;
  }

  getLimit = async () => {
    const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.eBridgeCrossTransferLimit, {
      chainType: 'aelf',
      rpcUrl: '',
      chainInfo: JSON.stringify(this.chainInfo),
      options: JSON.stringify(this.options),
    });

    if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
    return resMessage.message;
  };

  getELFFee = async () => {
    const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.eBridgeCrossTransferELFFee, {
      chainType: 'aelf',
      rpcUrl: '',
      chainInfo: JSON.stringify(this.chainInfo),
      options: JSON.stringify(this.options),
    });

    if (resMessage.code === SandboxErrorCode.error) throw resMessage.message;
    return resMessage.message;
  };

  createReceipt = async (params: Omit<ICreateReceiptParams, 'tokenContract' | 'portkeyContract'>) => {
    const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.eBridgeCrossTransfer, {
      chainType: 'aelf',
      rpcUrl: '',
      pin: this.pin,
      chainInfo: JSON.stringify(this.chainInfo),
      walletInfo: JSON.stringify(this.wallet),
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
