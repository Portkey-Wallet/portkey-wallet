import { renderHook } from '@testing-library/react-hooks';
import { useCaInfoOnChain } from './useCaInfoOnChain';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { isAddress } from '@portkey-wallet/utils';
import InternalMessage from 'messages/InternalMessage';
import { currentWallet } from '../../../../../test/data/chainInfo';

jest.mock('@portkey-wallet/hooks/hooks-ca/network');
jest.mock('@portkey-wallet/hooks/hooks-ca/wallet');
jest.mock('@portkey-wallet/store/store-ca/wallet/actions');
jest.mock('utils/sandboxUtil/getHolderInfo');
jest.mock('@portkey-wallet/utils');
jest.mock('messages/InternalMessage');
jest.mock('store/Provider/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
}));

describe('useCaInfoOnChain', () => {
  test('no chainList, cannot fetch data', async () => {
    const currentNetwork: any = {
      walletType: 'aelf',
    };
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);

    renderHook(() => useCaInfoOnChain());

    expect(useCurrentWallet).toBeCalled();
    expect(useCurrentNetworkInfo).toBeCalled();
  });

  test('no caHash in walletInfo, cannot fetch data', () => {
    const walletInfo: any = {};
    const chainList: any = [
      {
        chainId: 'AELF',
        chainName: 'AELF',
        endPoint: 'http://192.168.66.61:8000',
        explorerUrl: 'http://192.168.66.61:8000',
        caContractAddress: 'xsnQafDAhNTeYcooptETqWnYBksFGGXxfcQyJJ5tmu6Ak9ZZt',
        lastModifyTime: '2023-03-02T07:43:54.5819059Z',
        id: 'AELF',
      },
    ];
    const currentNetwork: any = {
      walletType: 'aelf',
    };
    jest.mocked(useCurrentWallet).mockReturnValue({
      walletInfo: walletInfo,
      chainList: chainList,
      walletAvatar: '',
      walletType: 'aelf',
      currentNetwork: 'TESTNET',
    });
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);
    jest.mocked(isAddress).mockReturnValue(true);

    renderHook(() => useCaInfoOnChain());

    expect(useCurrentWallet).toBeCalled();
    expect(useCurrentNetworkInfo).toBeCalled();
  });

  test('no chain information, poll for data', () => {
    const walletInfo: any = {
      caHash: 'f...38c',
    };
    const chainList: any = [
      {
        chainId: 'AELF',
        chainName: 'AELF',
        endPoint: 'http://192.168.66.61:8000',
        explorerUrl: 'http://192.168.66.61:8000',
        caContractAddress: 'xsnQafDAhNTeYcooptETqWnYBksFGGXxfcQyJJ5tmu6Ak9ZZt',
        lastModifyTime: '2023-03-02T07:43:54.5819059Z',
        id: 'AELF',
      },
      {
        chainId: 'tDVV',
        chainName: 'tDVV',
        endPoint: 'http://192.168.66.100:8000',
        explorerUrl: 'http://192.168.66.100:8000',
        caContractAddress: '2YkKkNZKCcsfUsGwCfJ6wyTx5NYLgpCg1stBuRT4z5ep3psXNG',
        lastModifyTime: '2023-03-02T07:44:42.852515Z',
        id: 'tDVV',
      },
    ];
    const currentNetwork: any = {
      walletType: 'aelf',
    };
    jest.mocked(useCurrentWallet).mockReturnValue({
      walletInfo: walletInfo,
      chainList: chainList,
      walletAvatar: '',
      walletType: 'aelf',
      currentNetwork: 'TESTNET',
    });
    const getSeedResult = {
      data: {
        privateKey: 'your-private-key',
      },
    };
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);
    jest.mocked(isAddress).mockReturnValue(true);
    jest.mocked(InternalMessage.payload).mockImplementation(() => {
      return { send: jest.fn(() => Promise.resolve(getSeedResult)) } as any;
    });
    jest
      .mocked(getHolderInfoByContract)
      .mockReturnValue(Promise.resolve({ code: 1, result: { caAddress: '2Xu...nkd', caHash: '0xf...djs' } }));

    renderHook(() => useCaInfoOnChain());
    expect(useCurrentWallet).toBeCalled();
    expect(useCurrentNetworkInfo).toBeCalled();
    expect(InternalMessage.payload).toBeCalled();
  });

  test('without pin, the getHolderInfoByChainId method is not executed', () => {
    const walletInfo: any = {
      caHash: 'f...38c',
    };
    const chainList: any = [
      {
        chainId: 'AELF',
        chainName: 'AELF',
        endPoint: 'http://192.168.66.61:8000',
        explorerUrl: 'http://192.168.66.61:8000',
        caContractAddress: 'xsnQafDAhNTeYcooptETqWnYBksFGGXxfcQyJJ5tmu6Ak9ZZt',
        lastModifyTime: '2023-03-02T07:43:54.5819059Z',
        id: 'AELF',
      },
      {
        chainId: 'tDVV',
        chainName: 'tDVV',
        endPoint: 'http://192.168.66.100:8000',
        explorerUrl: 'http://192.168.66.100:8000',
        caContractAddress: '2YkKkNZKCcsfUsGwCfJ6wyTx5NYLgpCg1stBuRT4z5ep3psXNG',
        lastModifyTime: '2023-03-02T07:44:42.852515Z',
        id: 'tDVV',
      },
    ];
    const currentNetwork: any = {
      walletType: 'aelf',
    };
    jest.mocked(useCurrentWallet).mockReturnValue({
      walletInfo: walletInfo,
      chainList: chainList,
      walletAvatar: '',
      walletType: 'aelf',
      currentNetwork: 'TESTNET',
    });
    const getSeedResult = {
      data: {
        privateKey: undefined,
      },
    };
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);
    jest
      .mocked(getHolderInfoByContract)
      .mockReturnValue(Promise.resolve({ code: 1, result: { caAddress: '2Xu...nkd', caHash: '0xf...djs' } }));
    jest.mocked(setCAInfo).mockImplementation();
    jest.mocked(isAddress).mockReturnValue(true);
    jest.mocked(InternalMessage.payload).mockImplementation(() => {
      return { send: jest.fn(() => Promise.resolve(getSeedResult)) } as any;
    });

    renderHook(() => useCaInfoOnChain());

    expect(useCurrentWallet).toBeCalled();
    expect(useCurrentNetworkInfo).toBeCalled();
    expect(InternalMessage.payload).toBeCalled();
  });

  test('with chain information, there is no need to poll for data', async () => {
    const chainList: any = [
      {
        chainId: 'AELF',
        endPoint: 'https://mainnet.infura.io/v3/your-project-id',
        caContractAddress: '0x1234567890abcdef',
      },
    ];
    const walletInfo: any = {
      AELF: {
        caAddress: '2tgCgt32ZBSgB26XPGSWdkeaizNsnykLrc7eoUzJ8dV6wrzap8',
        caHash: 'f891ac1c866c0c99d63a629c68ceafb5bd7fc2a24572b2afcff48005f133538c',
      },
    };
    const currentNetwork: any = {
      walletType: 'aelf',
    };
    jest.mocked(useCurrentWallet).mockReturnValue({
      walletInfo: walletInfo,
      chainList: chainList,
      walletAvatar: '',
      walletType: 'aelf',
      currentNetwork: 'TESTNET',
    });
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);

    renderHook(() => useCaInfoOnChain());

    expect(useCurrentWallet).toBeCalled();
    expect(useCurrentNetworkInfo).toBeCalled();
  });
});
