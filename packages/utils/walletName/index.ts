import { request } from '@portkey-wallet/api/api-did';
import {
  TShouldShowSetNewWalletNameModalResponse,
  TShouldShowSetNewWalletNameIconResponse,
  ISetNewWalletNameParams,
  IWalletNameService,
} from '@portkey-wallet/types/types-ca/walletName';

class WalletNameService implements IWalletNameService {
  async shouldShowSetNewWalletNameModal(): Promise<TShouldShowSetNewWalletNameModalResponse> {
    const shouldShowModal = await request.wallet.shouldShowSetNewWalletNameModal();
    return shouldShowModal;
  }

  async shouldShowSetNewWalletNameIcon(): Promise<TShouldShowSetNewWalletNameIconResponse> {
    const shouldShowIcon = await request.wallet.shouldShowSetNewWalletNameIcon();
    return shouldShowIcon;
  }

  async setNewWalletName(params: ISetNewWalletNameParams): Promise<void> {
    await request.wallet.setNewWalletName({
      params,
    });
  }
}

const walletNameService = new WalletNameService();
export default walletNameService;
