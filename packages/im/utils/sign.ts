import AElf from 'aelf-sdk';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import RelationIM from '@relationlabs/im';
import { FetchRequest } from '@portkey/request';
const fetchRequest = new FetchRequest({
  baseURL: 'https://api.relationlabs.ai',
  headers: {
    // RelationOne api need Accept: 'application/json, text/plain, */*',
    Accept: 'application/json, text/plain, */*',
  },
});

export const sign = async (message: string, account: AElfWallet, caHash: string) => {
  if (!account.keyPair) {
    throw new Error('no keyPair');
  }

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

  const {
    data: { token },
  } = await fetchRequest.send({
    url: '/api/v1/verify/aelf',
    method: 'POST',
    body: JSON.stringify({
      message,
      signature: signatureStr,
      address: account.address,
      caHash,
    }),
  });

  // TODO: RelationIM test APIKEY
  const APIKEY = '581c6c4fa0b54912b00088aa563342a4';
  const { error, token: unifiedAuthToken } = await RelationIM.getRelationToken(token, APIKEY);

  if (error) {
    throw error;
  }
  return unifiedAuthToken;
};
