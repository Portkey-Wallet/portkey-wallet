import AElf from 'aelf-sdk';

export const generateNonceAndTimestamp = (managerAddress: string) => {
  if (!managerAddress) {
    throw new Error('managerAddress is required');
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const nonceStr = `${timestamp}${managerAddress}`;
  return {
    nonce: AElf.utils.sha256(nonceStr),
    timestamp,
  };
};
