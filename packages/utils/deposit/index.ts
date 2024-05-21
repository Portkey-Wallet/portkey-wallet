import { request } from '@portkey-wallet/api/api-did';
import {
  TGetTokenListRequest,
  TTokenItem,
  TGetTokenListByNetworkRequest,
  TGetDepositTokenListRequest,
  TDepositTokenItem,
  TGetNetworkListRequest,
  TNetworkItem,
  TGetDepositInfoRequest,
  TDepositInfo,
  TGetDepositCalculateRequest,
  TConversionRate,
  IDepositService,
  TQueryTransferAuthTokenRequest,
  NetworkStatus,
  BusinessType,
} from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';

class DepositService implements IDepositService {
  private transferToken = '';

  async requestTokenIfNeeded() {
    if (!this.transferToken) {
      const token = await this.getTransferToken({});
      this.transferToken = token;
    }
    request.set('headers', { 'T-Authorization': this.transferToken });
  }

  async getTokenList(params: TGetTokenListRequest): Promise<TTokenItem[]> {
    await this.requestTokenIfNeeded();
    const {
      data: { tokenList },
    } = await request.deposit.getTokenList({
      params,
    });
    return tokenList;
  }

  async getTokenListByNetwork(params: TGetTokenListByNetworkRequest): Promise<TTokenItem[]> {
    await this.requestTokenIfNeeded();
    const {
      data: { tokenList },
    } = await request.deposit.getTokenListByNetwork({
      params,
    });
    return tokenList;
  }

  async getDepositTokenList(): Promise<TDepositTokenItem[]> {
    return new Promise(resolve => {
      const tokenList: TDepositTokenItem[] = [
        {
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
          icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
          contractAddress: '',
          toTokenList: [
            {
              name: 'Tether USD',
              symbol: 'USDT',
              chainIdList: ['tDVW', 'AELF'],
              decimals: 6,
              icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
            },
            {
              name: 'SGR',
              symbol: 'SGR-1',
              chainIdList: ['tDVW'],
              decimals: 8,
              icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png',
            },
          ],
        },
        {
          name: 'SGR',
          symbol: 'SGR-1',
          decimals: 8,
          icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png',
          contractAddress: '',
          toTokenList: [
            {
              name: 'SGR',
              symbol: 'SGR-1',
              chainIdList: ['tDVW'],
              decimals: 8,
              icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png',
            },
          ],
        },
        {
          name: 'ELF',
          symbol: 'ELF',
          decimals: 8,
          icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/ELF/logo.png',
          contractAddress: '',
          toTokenList: [
            {
              name: 'ELF',
              symbol: 'ELF',
              chainIdList: ['tDVW', 'AELF'],
              decimals: 8,
              icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/ELF/logo.png',
            },
          ],
        },
      ];
      resolve(tokenList);
    });
    const params: TGetDepositTokenListRequest = {
      type: BusinessType.Deposit,
    };
    const {
      data: { tokenList },
    } = await request.deposit.getDepositTokenList({
      params,
    });
    return tokenList;
  }

  async getNetworkList({ chainId, symbol }: { chainId: ChainId; symbol: string }): Promise<TNetworkItem[]> {
    return new Promise(resolve => {
      const networkList: TNetworkItem[] = [
        {
          network: 'SETH',
          name: 'SEthereum (ERC20)',
          multiConfirm: '64 confirmations',
          multiConfirmTime: '21mins',
          contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          explorerUrl: 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7',
          status: NetworkStatus.Health,
          withdrawFee: undefined,
          withdrawFeeUnit: undefined,
        },
        {
          network: 'TRX',
          name: 'TRON (TRC20)',
          multiConfirm: '27 confirmations',
          multiConfirmTime: '5mins',
          contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          explorerUrl: 'https://tronscan.io/#/contract/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          status: NetworkStatus.Health,
          withdrawFee: undefined,
          withdrawFeeUnit: undefined,
        },
        {
          network: 'BSC',
          name: 'BNB Smart Chain (BEP20)',
          multiConfirm: '15 confirmations',
          multiConfirmTime: '4mins',
          contractAddress: '0x3f280ee5876ce8b15081947e0f189e336bb740a5',
          explorerUrl: 'https://testnet.bscscan.com/address/0x3f280ee5876ce8b15081947e0f189e336bb740a5',
          status: NetworkStatus.Health,
          withdrawFee: undefined,
          withdrawFeeUnit: undefined,
        },
      ];
      resolve(networkList);
    });
    const params: TGetNetworkListRequest = {
      type: BusinessType.Deposit,
      chainId,
      symbol,
    };
    const {
      data: { networkList },
    } = await request.deposit.getNetworkList({
      params,
    });
    return networkList;
  }

  async getDepositInfo(params: TGetDepositInfoRequest): Promise<TDepositInfo> {
    return new Promise(resolve => {
      const depositInfo: TDepositInfo = {
        depositAddress: '0xb99e9c1367e3afda93b815c700e3d27b3b3bee7b',
        minAmount: '0',
        minAmountUsd: '0',
        extraNotes: [
          'Deposits will be unlocked and available for withdrawal/other activities after Bundle 2 confirmation.',
          "To avoid potential losses, please don't deposit tokens other than USDT.",
        ],
      };
      resolve(depositInfo);
    });
    const {
      data: { depositInfo },
    } = await request.deposit.getDepositInfo({
      params,
    });
    return depositInfo;
  }

  async depositCalculator(params: TGetDepositCalculateRequest): Promise<TConversionRate> {
    return new Promise(resolve => {
      const conversionRate: TConversionRate = {
        fromSymbol: 'USDT',
        toSymbol: 'SGR-1',
        fromAmount: '1',
        toAmount: '0.08256395',
        minimumReceiveAmount: '0.07843575',
      };
      resolve(conversionRate);
    });
    const {
      data: { conversionRate },
    } = await request.deposit.depositCalculator({
      params,
    });
    return conversionRate;
  }

  getTransferToken(params: TQueryTransferAuthTokenRequest): Promise<string> {
    return new Promise(resolve => {
      resolve('hello world');
    });
  }
}

const depositService = new DepositService();
export default depositService;

export const getTokenList = async (params: TGetTokenListRequest): Promise<TTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getTokenList({
    params,
  });
  return tokenList;
};

export const getTokenListByNetwork = async (params: TGetTokenListByNetworkRequest): Promise<TTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getTokenListByNetwork({
    params,
  });
  return tokenList;
};

export const getDepositTokenList = async (params: TGetDepositTokenListRequest): Promise<TDepositTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getDepositTokenList({
    params,
  });
  return tokenList;
};

export const getNetworkList = async (params: TGetNetworkListRequest): Promise<TNetworkItem[]> => {
  const {
    data: { networkList },
  } = await request.deposit.getNetworkList({
    params,
  });
  return networkList;
};

export const getDepositInfo = async (params: TGetDepositInfoRequest): Promise<TDepositInfo> => {
  const {
    data: { depositInfo },
  } = await request.deposit.getDepositInfo({
    params,
  });
  return depositInfo;
};

export const depositCalculator = async (params: TGetDepositCalculateRequest): Promise<TConversionRate> => {
  const {
    data: { conversionRate },
  } = await request.deposit.depositCalculator({
    params,
  });
  return conversionRate;
};

// todo_wade: fix the type
export const getTransferToken = async (params: { chain_id: string }): Promise<string> => {
  // console.log('aaaaaa request.headers : ', request.headers);
  request.set('headers', { 'T-Authorization': 'T-authorization-TEST' });
  console.log('aaaaaa request.defaultConfig : ', request.defaultConfig);
  // const {
  //   data: { access_token },
  // } = await request.deposit.getTransferToken({
  //   params,
  // });
  const access_token = '';
  console.log('aaaaaa access_token : ', access_token);
  return access_token;
};
