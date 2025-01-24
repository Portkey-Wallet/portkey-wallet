// // import { useCurrentWallet } from './wallet';
// import { useMemo } from 'react';
// import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
// import { useAppEOASelector } from './index';
// import { useWalletState } from './wallet';
// import { useAppCommonDispatch } from '..';

// export function useNetworkList() {
//   return NetworkList;
// }

// export function useCurrentNetwork() {
//   const { networkType } = useWalletState();
//   return useMemo(() => networkType || 'TESTNET', [networkType]);
// }

// export function useCurrentNetworkInfo() {
//   const currentNetwork = useCurrentNetwork();
//   const networkList = useNetworkList();
//   return useMemo(
//     () => networkList.find(item => item.networkType === currentNetwork) || networkList[0],
//     [currentNetwork, networkList],
//   );
// }

// export function useCurrentApiUrl() {
//   const currentNetworkInfo = useCurrentNetworkInfo();
//   return useMemo(() => currentNetworkInfo.eoaApiUrl, [currentNetworkInfo.eoaApiUrl]);
// }

// // export function useVerifierList() {
// //   const { verifierMap } = useAppEOASelector(state => state.guardians);
// //   return useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);
// // }

// export function useIsMainnet() {
//   const currentNetwork = useCurrentNetwork();
//   return useMemo(() => currentNetwork === 'MAINNET', [currentNetwork]);
// }

// // export function useIsIMServiceExist() {
// //   const { imApiUrl, imWsUrl, imS3Bucket } = useCurrentNetworkInfo();
// //   return useMemo(() => !!imApiUrl && !!imWsUrl && !!imS3Bucket, [imApiUrl, imWsUrl, imS3Bucket]);
// // }
