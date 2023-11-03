import { IRampSellSocket } from '../types/sellSocket';

// TODO
export class RampSellSocket implements IRampSellSocket {
  public webSocket: any;

  constructor() {
    this.webSocket = {};
  }
}
