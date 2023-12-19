export default function checkMain(networkType: string | undefined, chainId: string | number) {
  return networkType === 'MAINNET' && chainId === 'AELF';
}
