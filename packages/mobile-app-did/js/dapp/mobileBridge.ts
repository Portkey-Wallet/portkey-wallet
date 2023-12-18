import { Share, ShareAction } from 'react-native';

export type ShareOptions = {
  message: string;
  url?: string; // iOS only
  title?: string; // android only
};
export interface IPortkeyBridge {
  showShareMenu(options: ShareOptions): Promise<ShareAction>; // share
}

class BaseLock {
  public LockMap: Map<string, boolean> = new Map();
  public lock(key: string): void {
    this.LockMap.set(key, true);
  }
  public unlock(key: string): void {
    this.LockMap.delete(key);
  }
  public isLocked(key: string): boolean {
    return !this.LockMap.get(key);
  }
}
export const BridgeMethodsBase = {
  SHOW_SHARE_MENU: 'bridge_showShareMenu',
} as const;

export class PortkeyBridge extends BaseLock implements IPortkeyBridge {
  [key: string]: any;
  constructor() {
    super();
    this[BridgeMethodsBase.SHOW_SHARE_MENU] = this.showShareMenu;
  }
  public async showShareMenu(options: ShareOptions): Promise<ShareAction> {
    const key = 'showShareMenu';
    if (this.isLocked(key)) throw new Error('is locked');
    this.lock(key);
    try {
      const shareAction = await Share.share(options);
      return shareAction;
    } finally {
      this.unlock(key);
    }
  }
}

export const portkeyBridge = new PortkeyBridge();
