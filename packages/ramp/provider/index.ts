import { RampType } from '../constants';
import {
  IRampProviderInfo,
  IRampService,
  IRampSellSocket,
  IRampProviderOptions,
  IAlchemyRampService,
  IAlchemyRampProviderOptions,
  ITransakRampService,
  ITransakRampProviderOptions,
  IAlchemyProvider,
  ITransakProvider,
  IRampProviderGenerateUrl,
} from '../types';

export abstract class RampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: IRampProviderOptions) {
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  // for go to pay
  abstract generateUrl(params: IRampProviderGenerateUrl): void;
}

export class AlchemyProvider extends RampProvider implements IAlchemyProvider {
  public providerInfo: IRampProviderInfo;
  public service: IAlchemyRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: IAlchemyRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  generateUrl(params: IRampProviderGenerateUrl) {
    if (params?.email) {
      this.getAchToken(params.email);
    }

    // TODO
    this.getAchSignature(params.address);
    if (params.type === RampType.BUY) {
      return '';
    }
    return '';
  }

  public getAchToken(email: string) {
    this.service.getAchToken({ email });
  }

  public getAchSignature(address: string) {
    this.service.getAchSignature({ address });
  }
}

export class TransakProvider extends RampProvider implements ITransakProvider {
  public providerInfo: IRampProviderInfo;
  public service: ITransakRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: ITransakRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  generateUrl(params: IRampProviderGenerateUrl) {
    // TODO
    if (params.type === RampType.BUY) {
      return '';
    }
    return '';
  }
}
