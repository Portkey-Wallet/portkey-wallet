import { ExtensionDappManager } from './ExtensionDappManager';
import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';

describe('ExtensionDappManager', () => {
  describe('isActive', () => {
    test('should return true if the origin is active and not locked', async () => {
      const isActiveSpy = jest.spyOn(DappManager.prototype, 'isActive').mockResolvedValue(true);
      const dappManager = new ExtensionDappManager({
        store: {},
        locked: () => false,
      });
      const isActive = await dappManager.isActive('http://localhost:3000');
      expect(isActiveSpy).toBeCalledWith('http://localhost:3000');
      expect(isActive).toBe(true);
    });

    test('should return false if the origin is not active', async () => {
      const isActiveSpy = jest.spyOn(DappManager.prototype, 'isActive').mockResolvedValue(false);
      const dappManager = new ExtensionDappManager({
        store: {},
        locked: () => false,
      });
      const isActive = await dappManager.isActive('http://not-active.com');
      expect(isActiveSpy).toBeCalledWith('http://localhost:3000');
      expect(isActive).toBe(false);
    });

    test('should return false if the extension is locked', async () => {
      const isActiveSpy = jest.spyOn(DappManager.prototype, 'isActive').mockResolvedValue(true);
      const dappManager = new ExtensionDappManager({
        store: {},
        locked: () => true,
      });
      const isActive = await dappManager.isActive('http://localhost:3000');
      expect(isActiveSpy).toBeCalledWith('http://localhost:3000');
      expect(isActive).toBe(false);
    });
  });

  describe('isLocked', () => {
    test('should return true if locked is true', async () => {
      const dappManager = new ExtensionDappManager({
        store: {},
        locked: () => true,
      });
      const isLocked = await dappManager.isLocked();
      expect(isLocked).toBe(true);
    });

    test('should return false if locked is false', async () => {
      const dappManager = new ExtensionDappManager({
        store: {},
        locked: () => false,
      });
      const isLocked = await dappManager.isLocked();
      expect(isLocked).toBe(false);
    });
  });
});
