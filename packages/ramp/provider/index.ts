import { RampType } from '../constants';
import {
  IRampProviderInfo,
  IRampService,
  IRampProviderOptions,
  IAlchemyPayRampService,
  IAlchemyPayRampProviderOptions,
  IAlchemyPayProvider,
  IRampProviderCreateOrderParams,
  IRampProvider,
  IRampProviderCreateOrderResult,
} from '../types';

export abstract class RampProvider implements IRampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;

  constructor(options: IRampProviderOptions) {
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }
  abstract createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult>;
}

export class AlchemyPayProvider extends RampProvider implements IAlchemyPayProvider {
  public providerInfo: IRampProviderInfo;
  public service: IAlchemyPayRampService;

  constructor(options: IAlchemyPayRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }

  async createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult> {
    if (params?.email) {
      this.getToken(params.email);
    }

    // TODO
    this.getSignature(params.address);
    if (params.type === RampType.BUY) {
      return { orderId: '', url: '' };
    }
    return { orderId: '', url: '' };
  }

  public getToken(email: string) {
    this.service.getAchPayToken({ email });
  }

  public getSignature(address: string) {
    this.service.getAchPaySignature({ address });
  }
}

export class TransakProvider extends RampProvider implements IRampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;

  constructor(options: IRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }

  async createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult> {
    // TODO
    if (params.type === RampType.BUY) {
      return { orderId: '', url: '' };
    }
    return { orderId: '', url: '' };
  }
}
