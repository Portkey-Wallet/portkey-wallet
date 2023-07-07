import SWEventController from './SWEventController';
// import { getConnections, setLocalStorage } from 'utils/storage/storage.utils';
// import errorHandler from 'utils/errorHandler';

// Mock dependencies
jest.mock('utils/storage/storage.utils', () => ({
  getConnections: jest.fn(),
}));
jest.mock('utils/errorHandler', () => jest.fn());
jest.mock('utils/storage/chromeStorage', () => ({
  setLocalStorage: jest.fn(),
}));
describe('SWEventController', () => {
  describe('registerOperator', () => {
    it('should throw error if sender.url or sender.tab.id does not exist', async () => {
      const sender = {};

      const errorHandlerMock = jest.requireMock('utils/errorHandler');
      // errorHandlerMock.mockReturnRejectedValue(600001);
      expect(SWEventController.registerOperator(sender)).toThrowError();
      expect(errorHandlerMock).toHaveBeenCalledWith(600001);
    });

    it('should register the operator and update connections', async () => {
      const sender = {
        url: 'http://example.com',
        tab: {
          id: 123,
        },
        id: 'senderId',
        origin: 'senderOrigin',
      };

      const connections = {};

      const getConnectionsMock = jest.requireMock('utils/storage/storage.utils').getConnections;
      getConnectionsMock.mockResolvedValue(connections);

      const setLocalStorageMock = jest.requireMock('utils/storage/chromeStorage').setLocalStorage;
      setLocalStorageMock.mockResolvedValue(null);

      await SWEventController.registerOperator(sender as any);

      expect(getConnectionsMock).toHaveBeenCalled();
      expect(setLocalStorageMock).toHaveBeenCalledWith({
        connections: {
          [sender.url]: {
            id: sender.id,
            origin: sender.origin,
            tabs: [sender.tab.id],
          },
        },
      });
    });
  });
});
