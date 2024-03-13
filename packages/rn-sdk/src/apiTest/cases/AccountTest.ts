import { getUnlockedWallet } from 'model/wallet';
import { TestCaseApi } from 'apiTest/type';
import { WalletState, portkey } from 'api';
// import Portkey from 'api';

//This array stores test cases where the wallet is the unlocked state
export const UnLockedWalletTestCases: Array<TestCaseApi> = [
  {
    describe: 'Test callCaContractMethod: GetVerifierServers',
    run: async (testContext, caseName) => {
      try {
        // const p2 = new Portkey();
        const result = await portkey.callCaContractMethod({
          contractMethodName: 'GetVerifierServers',
          isViewMethod: true,
          params: {},
        });
        testContext.assert(caseName, result.status === 'success', 'invoke failed:' + result.error);
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test callCaContractMethod: GetHolderInfo',
    run: async (testContext, caseName) => {
      try {
        const wallet = await getUnlockedWallet({ getMultiCaAddresses: false });
        const {
          caInfo: { caHash },
        } = wallet;
        const result = await portkey.callCaContractMethod({
          contractMethodName: 'GetHolderInfo',
          isViewMethod: true,
          params: { caHash },
        });
        testContext.assert(caseName, result.status === 'success', 'invoke failed:' + result.error);
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getWalletInfo',
    run: async (testContext, caseName) => {
      try {
        const walletInfo = await portkey.getWalletInfo();
        const assertSuccess = 'address' in walletInfo;
        testContext.assert(caseName, assertSuccess, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getWalletInfo containMultiCaAddresses',
    run: async (testContext, caseName) => {
      try {
        const walletInfo = await portkey.getWalletInfo(true);
        const assertSuccess = 'address' in walletInfo && 'multiCaAddresses' in walletInfo;
        testContext.assert(caseName, assertSuccess, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getWalletState: WalletState is unlocked',
    run: async (testContext, caseName) => {
      try {
        const walletState = await portkey.getWalletState();
        testContext.assert(caseName, walletState === WalletState.UNLOCKED, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getAssetsInfo',
    run: async (testContext, caseName) => {
      try {
        const assetsState = await portkey.getAssetsInfo();
        const assertSuccess = 'data' in assetsState && 'totalRecordCount' in assetsState;
        console.log(JSON.stringify(assetsState.data));
        testContext.assert(caseName, assertSuccess, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getActivityInfoList by default totalCount',
    run: async (testContext, caseName) => {
      try {
        const response = await portkey.getActivityInfoList();
        testContext.assert(caseName, (response?.data?.length ?? 0) === 30, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
  {
    describe: 'Test getActivityInfoList totalCount is 20',
    run: async (testContext, caseName) => {
      try {
        const response = await portkey.getActivityInfoList({ offset: 0, pageSize: 20 });
        testContext.assert(caseName, (response?.data?.length ?? 0) === 20, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
];
//This array stores test cases where the wallet is the locked state
export const LockedWalletTestCases: Array<TestCaseApi> = [
  {
    describe: 'Test getWalletState: WalletState is locked',
    run: async (testContext, caseName) => {
      try {
        const walletState = await portkey.getWalletState();
        testContext.assert(caseName, walletState === WalletState.LOCKED, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
];
//This array stores test cases without wallet
export const NoneWalletTestCases: Array<TestCaseApi> = [
  {
    describe: 'Test getWalletState: Wallet is none',
    run: async (testContext, caseName) => {
      try {
        const walletState = await portkey.getWalletState();
        testContext.assert(caseName, walletState === WalletState.NONE, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
];
//Special case， lock wallet op
export const LockWalletCase: Array<TestCaseApi> = [
  {
    describe: 'Test lockWallet',
    run: async (testContext, caseName) => {
      try {
        const result = await portkey.lockWallet();
        testContext.assert(caseName, result, 'invoke failed');
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
];
//Special case， exit wallet op
export const ExitWalletCase: Array<TestCaseApi> = [
  {
    describe: 'Test exitWallet',
    run: async (testContext, caseName) => {
      try {
        const result = await portkey.exitWallet();
        testContext.assert(caseName, result, 'invoke failed');
        console.warn(JSON.stringify(result));
      } catch (e: any) {
        testContext.assert(caseName, false, e?.toString() ?? 'failed');
      }
    },
  },
];
