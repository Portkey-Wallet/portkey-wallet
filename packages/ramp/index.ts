import { RampConfig } from './config';
import { RampService } from './service';
import { IExtraInfo, IInputInfo, IProviderInfo, IRampConfig, IRampProvider, IRampService } from './types';

export class Ramp {
  public config: IRampConfig;
  public service: IRampService;

  constructor() {
    this.config = new RampConfig();
    this.service = new RampService({ baseUrl: this.config.baseUrl });
  }
}

const ramp = new Ramp();

export default ramp;

export abstract class RampProvider {
  public providerInfo: IProviderInfo;
  public inputInfo: IInputInfo;
  public extraInfo: IExtraInfo;

  constructor(options: IRampProvider) {
    this.providerInfo = options.providerInfo;
    this.inputInfo = options.inputInfo;
    this.extraInfo = options?.extraInfo;
  }

  // for go to pay
  abstract generateUrl(): void;
}

export * from './api';
export * from './constants';
export * from './service';
export * from './types';
