import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import { TestCase } from 'service/JsModules/types';
import { decryptLocal, encryptLocal } from 'utils/crypto';

export const NetworkTestCases: Array<TestCase> = [
  {
    describe: 'GetNetworkInfo',
    run: async testContext => {
      const it = await NetworkController.getNetworkInfo();
      testContext.assert(it.totalCount > 0, 'totalCount should be greater than 0');
    },
  },
  {
    describe: 'EncryptLocal',
    run: async testContext => {
      const msg = 'i-am-error';
      const decrypted = await decryptLocal(await encryptLocal(msg));
      testContext.log('decrypted', decrypted);
      testContext.assert(msg === decrypted, 'msg should be the same after encrypt and decrypt');
    },
  },
  {
    describe: 'run GetTokenPrice well',
    run: async testContext => {
      const it = await NetworkController.fetchTokenPrices(['ELF']);
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getTokenPrice result');
    },
  },
  {
    describe: 'run getTokenInfo well',
    run: async testContext => {
      const it = await NetworkController.searchTokenList();
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getTokenInfo result');
    },
  },
  {
    describe: 'get multi ca addresses well',
    run: async testContext => {
      const wallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      testContext.assert(!!wallet, 'wallet should not be falsy');
      testContext.log(wallet, 'wallet');
    },
  },
  {
    describe: 'get account balance well',
    run: async testContext => {
      const wallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      const it = await NetworkController.fetchUserTokenBalance({
        maxResultCount: 100,
        skipCount: 0,
        caAddressInfos: Object.entries(wallet.multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
        })),
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getAccountBalance result');
    },
  },
  {
    describe: 'get nft collections well',
    run: async testContext => {
      const wallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      const it = await NetworkController.fetchNetCollections({
        maxResultCount: 100,
        skipCount: 0,
        caAddressInfos: Object.entries(wallet.multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
        })),
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getNftCollections result');
      const symbol = it.data[0]?.symbol;
      if (symbol) {
        const them = await NetworkController.fetchParticularNftItemList({
          maxResultCount: 100,
          skipCount: 0,
          symbol,
          caAddressInfos: Object.entries(wallet.multiCaAddresses).map(([chainId, caAddress]) => ({
            chainId,
            caAddress,
          })),
        });
        testContext.assert(!!them, 'nft items info should not be falsy');
        testContext.log(them, 'getNftItems result');
      }
    },
  },
  {
    describe: 'check user assets well',
    run: async testContext => {
      const wallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      const it = await NetworkController.searchUserAssets({
        caAddressInfos: Object.entries(wallet.multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
        })),
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'checkUserAssets result');
    },
  },
  {
    describe: 'get recent transaction address',
    run: async testContext => {
      const wallet = await getUnlockedWallet({ getMultiCaAddresses: true });
      const it = await NetworkController.getRecentTransactionInfo({
        caAddressInfos: Object.entries(wallet.multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
        })),
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getRecentTransactionUsers result');
    },
  },
  {
    describe: 'get contracts address',
    run: async testContext => {
      const it = await NetworkController.getContractInfo();
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'readContractsAddress result');
    },
  },
  {
    describe: 'get account recent activities and check one activity info',
    run: async testContext => {
      const { multiCaAddresses, address, originChainId } = await getUnlockedWallet({ getMultiCaAddresses: true });
      const it = await NetworkController.getRecentActivities({
        caAddressInfos: Object.entries(multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
        })),
        managerAddresses: [address],
        chainId: originChainId,
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'getRecentActivities result');
      const activity = it.data[0];
      if (activity) {
        const them = await NetworkController.getActivityInfo({
          transactionId: activity.transactionId,
          blockHash: activity.blockHash,
          caAddressInfos: Object.entries(multiCaAddresses).map(([chainId, caAddress]) => ({
            chainId,
            caAddress,
          })),
        });
        testContext.assert(!!them, 'activity info should not be falsy');
        testContext.log(them, 'getActivityInfo result');
      }
    },
  },
  {
    describe: 'check transaction fee',
    run: async testContext => {
      const it = await NetworkController.getTransactionFee({
        chainIds: ['AELF'],
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'checkTransactionFee result');
    },
  },
  {
    describe: 'check transfer security well',
    run: async testContext => {
      const {
        caInfo: { caHash },
        originChainId,
      } = await getUnlockedWallet();
      const it = await NetworkController.checkTransferSecurity({
        caHash,
        targetChainId: originChainId,
      });
      testContext.assert(!!it, 'it should not be falsy');
      testContext.log(it, 'checkTransferSecurity result');
    },
  },
];
