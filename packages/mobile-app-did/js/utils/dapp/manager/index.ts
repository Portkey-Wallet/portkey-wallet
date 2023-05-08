import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { RequestCode, RequestResponse, Web3OperationAdapter } from '../behaviour';
import WebsiteAuthentication from '../behaviour/auth';
import DappOperator from '../operator';
import { DappAuthManager } from './auth';
import { getWalletAddress } from 'utils/redux';

const unauthenticatedResponse: RequestResponse = {
  code: RequestCode.UNAUTHENTICATED,
  msg: 'unauthenticated, please connect to wallet first',
};

export default class DappOperationManager implements Web3OperationAdapter {
  private static ins: DappOperationManager = new DappOperationManager();

  public static getIns(): DappOperationManager {
    return DappOperationManager.ins;
  }

  // only used for test
  public static handleGreetings = async (): Promise<RequestResponse> => {
    return {
      code: 0,
      data: 'greetings from protkey',
    };
  };

  public authenticationCall = async (eventId: string, auth: WebsiteAuthentication, callback: () => void) =>
    auth?.hostName?.length > 0 && (await DappAuthManager.getIns().checkPermission(auth))
      ? callback()
      : DappOperator.getIns().publishEventCallback(eventId, unauthenticatedResponse);

  public getChainId = async (): Promise<{ chainId: string }> => {
    const chainInfo = useCurrentChainList();
    return { chainId: chainInfo?.[0]?.chainId ?? '' };
  };

  public getAccountAddress = async (): Promise<{ address: string }> => {
    return { address: getWalletAddress() ?? '' };
  };

  // TODO it is not implemented yet
  public decryptMessage = async ({
    message,
    account,
  }: {
    message: string;
    account: string;
  }): Promise<{ decryptedMessage: string }> => {
    return { decryptedMessage: '' };
  };
}
