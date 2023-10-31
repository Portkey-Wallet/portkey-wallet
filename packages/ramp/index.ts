import { RampConfig } from './config';
import { RampService } from './service';
import { IRampConfig, IRampService } from './types';

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

export * from './api';
export * from './constants';
export * from './service';
export * from './types';
