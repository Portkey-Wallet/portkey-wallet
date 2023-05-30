import { IDappInteractionStream, IRequestParams, IResponseType } from '@portkey/provider-types';
import Operator from '@portkey/providers/dist/Operator';
import DappEventBus from './dappEventBus';
export default class DappMobileOperator extends Operator {
  constructor(stream: IDappInteractionStream) {
    super(stream);
    this.onCreate();
  }

  private onCreate = () => {
    DappEventBus.registerOperator(this);
  };

  public onDestroy = () => {
    DappEventBus.unregisterOperator(this);
  };

  handleRequest = (request: IRequestParams<any>): Promise<IResponseType<any>> => {
    console.log('DappMobileOperator handleRequest', request);
    throw new Error('Method not implemented.');
  };
}
