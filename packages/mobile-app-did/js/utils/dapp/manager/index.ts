import { RequestResponse, Web3OperationAdapter } from '../behaviour';

export default class DappOperationManager implements Web3OperationAdapter {
  // only used for test
  public static handleGreetings = async (): Promise<RequestResponse> => {
    return {
      code: 0,
      data: 'greetings from protkey',
    };
  };
}
