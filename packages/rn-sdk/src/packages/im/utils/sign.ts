import AElf from 'aelf-sdk';
import { AElfWallet } from 'packages/types/aelf';

export const getVerifyData = (account: AElfWallet, caHash: string) => {
  if (!account.keyPair) {
    throw new Error('no keyPair');
  }
  const message = `${Date.now()}`;
  const hexMsg = AElf.utils.sha256(message);
  const signature = account.keyPair.sign(Buffer.from(hexMsg, 'hex'), {
    canonical: true,
  });
  if (signature.recoveryParam === null) {
    throw new Error('no recoveryParam');
  }
  const signatureStr = [
    signature.r.toString('hex', 64),
    signature.s.toString('hex', 64),
    `0${signature.recoveryParam.toString()}`,
  ].join('');

  return {
    message,
    signature: signatureStr,
    address: account.address,
    caHash,
  };
};
