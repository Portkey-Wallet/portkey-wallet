import ApprovalController from './ApprovalController';
import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';

jest.mock('service/NotificationService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      openPrompt: jest.fn(),
    };
  });
});

describe('ApprovalController', () => {
  let notificationService: any;
  let getPageState: jest.Mock;
  let controller: ApprovalController;

  beforeEach(() => {
    notificationService = new NotificationService();
    getPageState = jest.fn();
    controller = new ApprovalController({ notificationService, getPageState });
  });

  describe('authorizedToConnect', () => {
    test('should return permissionData', async () => {
      const promptData = { appName: 'My App', appLogo: 'logo.png', origin: 'https://example.com' };
      const permissionData = { success: true, message: 'Authorized' };
      notificationService.openPrompt.mockResolvedValue(permissionData);

      const result = await controller.authorizedToConnect(promptData);

      expect(notificationService.openPrompt).toHaveBeenCalledWith({
        method: PromptRouteTypes.CONNECT_WALLET,
        search: JSON.stringify({
          appName: 'My App',
          appLogo: 'logo.png',
          appHref: 'https://example.com',
        }),
      });
      expect(result).toEqual(permissionData);
    });

    test('should use origin as appName when appName is not provided', async () => {
      const promptData = { appLogo: 'logo.png', origin: 'https://example.com' };
      const permissionData = { success: true, message: 'Authorized' };
      notificationService.openPrompt.mockResolvedValue(permissionData);

      const result = await controller.authorizedToConnect(promptData);

      expect(notificationService.openPrompt).toHaveBeenCalledWith({
        method: PromptRouteTypes.CONNECT_WALLET,
        search: JSON.stringify({
          appName: 'https://example.com',
          appLogo: 'logo.png',
          appHref: 'https://example.com',
        }),
      });
      expect(result).toEqual(permissionData);
    });
  });

  describe('authorizedToSendTransactions', () => {
    test('should return permissionData', async () => {
      const promptData = {
        origin: 'https://example.com',
        transactionInfoId: '123',
        payload: { amount: 100, recipient: 'Alice' },
      };
      const permissionData = { success: true, message: 'Authorized' };
      notificationService.openPrompt.mockResolvedValue(permissionData);

      const result = await controller.authorizedToSendTransactions(promptData);

      expect(notificationService.openPrompt).toHaveBeenCalledWith({
        method: PromptRouteTypes.SEND_TRANSACTION,
        search: JSON.stringify(promptData),
      });
      expect(result).toEqual(permissionData);
    });
  });

  describe('authorizedToGetSignature', () => {
    test('should return permissionData', async () => {
      const promptData = { message: 'Sign this data' };
      const permissionData = { success: true, message: 'Authorized' };
      notificationService.openPrompt.mockResolvedValue(permissionData);

      const result = await controller.authorizedToGetSignature(promptData);

      expect(notificationService.openPrompt).toHaveBeenCalledWith({
        method: PromptRouteTypes.GET_SIGNATURE,
        search: JSON.stringify(promptData),
      });
      expect(result).toEqual(permissionData);
    });
  });
});
