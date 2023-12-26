import { AElfWallet } from '@portkey-wallet/types/aelf';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { stringify } from 'query-string';
import AElf from 'aelf-sdk';
import { request } from '../index';
import { ChainId } from '@portkey-wallet/types';
export type RefreshTokenConfig = {
  grant_type: 'signature';
  client_id: 'CAServer_App';
  scope: 'CAServer';
  signature: string;
  pubkey: string;
  timestamp: number;
  ca_hash: string;
  connectUrl: string;
  chainId: ChainId;
};

const BEARER = 'Bearer';

export const queryAuthorization = async (config: RefreshTokenConfig) => {
  const { connectUrl, ..._config } = config;
  const { access_token } = await customFetch(config.connectUrl + '/connect/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: stringify({ ..._config, chain_id: config.chainId }),
  });
  return `${BEARER} ${access_token}`;
};

export const formatTokenWithOutBear = (token: string) => {
  if (token.startsWith(BEARER)) return token.replace(`${BEARER} `, '');
  return token;
};

const DAY = 24 * 60 * 60 * 1000;

export const isValidRefreshTokenConfig = (config: RefreshTokenConfig) => {
  const expireTime = config.timestamp + 1 * DAY;
  return expireTime >= Date.now();
};

export function setRefreshTokenConfig({
  account,
  caHash,
  connectUrl,
  chainId,
}: {
  account: AElfWallet;
  caHash: string;
  connectUrl: string;
  chainId: ChainId;
}) {
  const timestamp = Date.now();
  const message = Buffer.from(`${account.address}-${timestamp}`).toString('hex');
  const signature = AElf.wallet.sign(message, account.keyPair).toString('hex');
  const pubkey = (account.keyPair as any).getPublic('hex');
  const ca_hash = caHash;

  return request.setRefreshTokenConfig({
    grant_type: 'signature',
    client_id: 'CAServer_App',
    scope: 'CAServer',
    signature: signature,
    pubkey,
    timestamp,
    ca_hash,
    connectUrl,
    chainId,
  });
}
