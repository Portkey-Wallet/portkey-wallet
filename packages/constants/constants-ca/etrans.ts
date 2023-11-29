import AElf from 'aelf-sdk';
import { EBRIDGE_DISCLAIMER_ARRAY } from './ebridge';

export type DisclaimerArrayType = { type: 'title' | 'text'; content: string }[];
export const ETRANS_DISCLAIMER_ARRAY = EBRIDGE_DISCLAIMER_ARRAY;
export const ETRANS_DISCLAIMER_TEXT = ETRANS_DISCLAIMER_ARRAY.map(ele => ele.content).join('');
export const ETRANS_DISCLAIMER_TEXT_SHARE256_POLICY_ID = AElf.utils.sha256(ETRANS_DISCLAIMER_TEXT);
