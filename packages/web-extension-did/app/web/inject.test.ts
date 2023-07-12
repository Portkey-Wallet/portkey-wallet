import { InitializeProvider, InpagePostStream } from '@portkey/extension-provider';
import { shouldInjectProvider } from '@portkey/provider-utils';
import Inject from './inject';

jest.mock('@portkey/extension-provider', () => {
  return {
    InitializeProvider: jest.fn(),
    InpagePostStream: jest.fn(),
  };
});

jest.mock('@portkey/provider-utils', () => {
  return {
    shouldInjectProvider: jest.fn(),
  };
});

describe('Inject', () => {
  let InitializeProviderMock: jest.Mock;
  let InpagePostStreamMock: jest.Mock;
  let shouldInjectProviderFn: jest.Mock;

  beforeEach(() => {
    InitializeProviderMock = InitializeProvider as jest.Mock;
    InpagePostStreamMock = InpagePostStream as unknown as jest.Mock;
    shouldInjectProviderFn = shouldInjectProvider as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initPortKey', () => {
    it('should initialize PortKey provider if shouldInjectProvider returns true', () => {
      shouldInjectProviderFn.mockReturnValue(true);
      const portkeyStream = { name: jest.fn() };
      InpagePostStreamMock.mockReturnValue(portkeyStream);

      new Inject();

      expect(shouldInjectProviderFn).toHaveBeenCalled();
      expect(InpagePostStreamMock).toHaveBeenCalledWith({ name: 'portkey-inpage' });
      expect(InitializeProviderMock).toHaveBeenCalledWith({ connectionStream: portkeyStream });
    });

    it('should not initialize PortKey provider if shouldInjectProvider returns false', () => {
      shouldInjectProviderFn.mockReturnValue(false);

      new Inject();

      expect(shouldInjectProviderFn).toHaveBeenCalled();
      expect(InpagePostStreamMock).not.toHaveBeenCalled();
      expect(InitializeProviderMock).not.toHaveBeenCalled();
    });
  });
});
