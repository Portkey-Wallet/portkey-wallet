import { RampType } from '../constants';
import {
  IRampProviderInfo,
  IRampService,
  IRampSellSocket,
  IRampProvider,
  IAlchemyRampService,
  IAlchemyRampProvider,
  ITransakRampService,
  ITransakRampProvider,
} from '../types';

export abstract class RampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: IRampProvider) {
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  // for go to pay
  abstract generateUrl(type: RampType): void;
}

export default class AlchemyProvider extends RampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IAlchemyRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: IAlchemyRampProvider) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  generateUrl(type: RampType) {
    // TODO
    if (type === RampType.BUY) {
      return '';
    }
    return '';
  }

  getAchToken() {
    this.service.getAchToken;
  }
}

export class TransakProvider extends RampProvider {
  public providerInfo: IRampProviderInfo;
  public service: ITransakRampService;
  public sellSocket: IRampSellSocket;

  constructor(options: ITransakRampProvider) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
    this.sellSocket = options.sellSocket;
  }

  generateUrl(type: RampType) {
    // TODO
    if (type === RampType.BUY) {
      return '';
    }
    return '';
  }
}
