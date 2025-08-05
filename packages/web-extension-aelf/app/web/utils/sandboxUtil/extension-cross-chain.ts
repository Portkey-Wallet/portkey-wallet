import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { CurrentWalletType } from '@portkey-wallet/types/wallet';
import { EBridge, TEBridgeOptions } from '@portkey-wallet/utils/eBridge';
import { ICreateReceiptParams } from '@portkey-wallet/utils/eBridge/types/bridge';
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
  public walletInfo: CurrentWalletType;
  public chainInfo: IChainItemType;
  constructor(options: TEBridgeOptions, pin: string, walletInfo: CurrentWalletType, chainInfo: IChainItemType) {
    super(options);
    this.pin = pin;
    this.walletInfo = walletInfo;
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
      walletInfo: JSON.stringify(this.walletInfo),
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
