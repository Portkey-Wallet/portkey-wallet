import { createAction } from '@reduxjs/toolkit';
import { VerifierItem, VerifyStatus } from 'packages/types/verifier';
import { GuardiansInfo } from 'packages/types/types-ca/guardian';

import { IVerifierInfo, StoreUserGuardianItem, UserGuardianItem, UserGuardianStatus } from './type';

export const resetGuardiansState = createAction('verifier/resetGuardiansState');

export const setVerifierListAction = createAction<VerifierItem[] | null>('verifier/setVerifierList');

export const setGuardiansAction = createAction<GuardiansInfo | null>('verifier/setGuardians');

export const setCurrentGuardianAction = createAction<UserGuardianItem>('verifier/setCurrentGuardian');

export const setUserGuardianItemStatus = createAction<{
  key: string;
  status: VerifyStatus;
  signature?: string;
  verificationDoc?: string;
  identifierHash?: string;
}>('verifier/setUserGuardianItemStatus');

export const setUserGuardianStatus = createAction<{ [x: string]: UserGuardianStatus }>(
  'verifier/setUserGuardianStatus',
);
export const resetUserGuardianStatus = createAction('verifier/resetUserGuardianStatus');

export const setUserGuardianSessionIdAction = createAction<{ key: string; verifierInfo: IVerifierInfo }>(
  'verifier/setUserGuardianSessionId',
);
export const setOpGuardianAction = createAction<StoreUserGuardianItem | undefined>('verifier/setOpGuardian');
export const setPreGuardianAction = createAction<StoreUserGuardianItem | undefined>('verifier/setPreGuardian');

export const resetGuardians = createAction('verifier/resetGuardians');
