import type { ec } from 'elliptic';
import { SessionExpiredPlan, SessionInfo } from '../types/session';
import { Timestamp } from '../types';
import AElf from 'aelf-sdk';
import dayjs from 'dayjs';

const HOUR = 60 * 60 * 1000;

interface IBaseSessionParams {
  origin: string;
  managerAddress: string;
  caHash: string;
  expiredPlan: SessionExpiredPlan;
  expiredTime: Timestamp;
}

interface ISignSessionParams extends IBaseSessionParams {
  keyPair: ec.KeyPair;
}

interface IVerifySessionParams extends IBaseSessionParams {
  keyPair: ec.KeyPair;
  signature: string;
}
export function formatSession({ origin, managerAddress, caHash, expiredPlan, expiredTime }: IBaseSessionParams) {
  const msg = JSON.stringify({
    origin,
    managerAddress,
    caHash,
    expiredPlan,
    expiredTime,
  });
  return AElf.utils.sha256(msg);
}

export function signSession(params: ISignSessionParams): string {
  const signOptions = params.keyPair.sign(formatSession(params));
  return Buffer.from(signOptions.toDER()).toString('hex');
}

export function verifySession(params: IVerifySessionParams) {
  return params.keyPair.verify(formatSession(params), params.signature);
}

export function hasSessionInfoExpired(sessionInfo: SessionInfo) {
  // always
  if (sessionInfo.expiredPlan === SessionExpiredPlan.always) return false;
  if (Date.now() < sessionInfo.expiredTime) return false;
  return true;
}

export function formatExpiredTime(plan: SessionExpiredPlan) {
  if (typeof plan === 'number') {
    return Date.now() + plan * HOUR;
  } else {
    return Date.now();
  }
}

export function formatTimeToStr(time?: number): string {
  if (time === undefined || time === null) return '--';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

export function checkSiteIsInBlackList(blackList: string[], origin: string): boolean {
  if (blackList.includes(origin) || blackList.includes('**')) return true;
  return false;
}
