import { VerifierItem, VerifyStatus } from '@portkey-wallet/types/verifier';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  resetGuardiansState,
  setUserGuardianItemStatus,
  setCurrentGuardianAction,
  setVerifierListAction,
  setUserGuardianSessionIdAction,
  setGuardiansAction,
  resetUserGuardianStatus,
  setUserGuardianStatus,
  setPreGuardianAction,
  setOpGuardianAction,
  resetGuardians,
} from './actions';
import { GuardiansState } from './type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { GUARDIAN_EXPIRED_TIME } from '@portkey-wallet/constants/misc';

const initialState: GuardiansState = {};
export const guardiansSlice = createSlice({
  name: 'guardians',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetGuardiansState, () => {
        return initialState;
      })
      .addCase(resetGuardians, state => {
        return { ...initialState, verifierMap: state.verifierMap };
      })
      .addCase(setVerifierListAction, (state, action) => {
        if (!action.payload) {
          state.verifierMap = {};
          return;
        }
        const map: GuardiansState['verifierMap'] = {};
        action.payload.forEach((item: VerifierItem) => {
          map[item.id] = item;
        });
        state.verifierMap = map;
      })
      .addCase(setGuardiansAction, (state, action) => {
        console.log('setGuardiansAction', JSON.parse(JSON.stringify(action.payload)));
        const { verifierMap } = state;
        if (!action.payload) {
          state.userGuardiansList = [];
          state.userGuardianStatus = {};
          return;
        }
        const { guardianList } = action.payload;
        const userStatus = state.userGuardianStatus ?? {};
        // TODO
        const _guardianList = guardianList.guardians.map(item => {
          const key = `${item.guardianIdentifier}&${item.verifierId}`;
          const _guardian = {
            ...item,
            guardianAccount: item.guardianIdentifier || item.identifierHash,
            guardianType: LoginType[item.type as any] as unknown as LoginType,
            key,
            verifier: verifierMap?.[item.verifierId],
            isLoginAccount: item.isLoginGuardian,
          };
          userStatus[key] = { ..._guardian, status: userStatus?.[key]?.status };
          return _guardian;
        });

        state.userGuardiansList = _guardianList;
        state.userGuardianStatus = userStatus;
        state.guardianExpiredTime = undefined;
      })
      .addCase(setPreGuardianAction, (state, action) => {
        console.log('setPreGuardianAction', JSON.parse(JSON.stringify(action.payload)));
        if (!action.payload) {
          state.preGuardian = undefined;
        } else {
          state.preGuardian = {
            ...state.userGuardianStatus?.[action.payload.key],
            ...action.payload,
          };
        }
      })
      .addCase(setOpGuardianAction, (state, action) => {
        console.log('setOpGuardianAction', JSON.parse(JSON.stringify(action.payload)));
        if (!action.payload) {
          state.opGuardian = undefined;
        } else {
          state.opGuardian = {
            ...state.userGuardianStatus?.[action.payload.key],
            ...action.payload,
          };
        }
      })
      .addCase(setCurrentGuardianAction, (state, action) => {
        console.log('setCurrentGuardianAction', JSON.parse(JSON.stringify(action.payload)));
        state.currentGuardian = {
          ...state.userGuardianStatus?.[action.payload.key],
          ...action.payload,
        };
        state.userGuardianStatus = {
          ...state.userGuardianStatus,
          [action.payload.key]: state.currentGuardian,
        };
      })
      .addCase(setUserGuardianStatus, (state, action) => {
        console.log('setUserGuardianStatus', JSON.parse(JSON.stringify(action.payload)));
        const userStatus = action.payload;
        state.userGuardianStatus = userStatus;
      })
      .addCase(setUserGuardianItemStatus, (state, action) => {
        const { key, status, signature, verificationDoc, identifierHash } = action.payload;
        console.log(
          'setUserGuardianItemStatus-state.userGuardianStatus',
          JSON.parse(JSON.stringify(state.userGuardianStatus)),
        );
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        console.log('setUserGuardianItemStatus-status', status);
        state.userGuardianStatus[key]['status'] = status;
        state.userGuardianStatus[key]['signature'] = signature;
        state.userGuardianStatus[key]['verificationDoc'] = verificationDoc;
        state.userGuardianStatus[key]['identifierHash'] = identifierHash || '';
        if (!state.guardianExpiredTime && status === VerifyStatus.Verified) {
          state.guardianExpiredTime = moment().add(GUARDIAN_EXPIRED_TIME, 'ms').valueOf();
        }
      })
      .addCase(resetUserGuardianStatus, state => {
        state.userGuardianStatus = {};
      })
      .addCase(setUserGuardianSessionIdAction, (state, action) => {
        const { key, verifierInfo } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['verifierInfo'] = verifierInfo;
        if (state.currentGuardian?.key === key) state.currentGuardian['verifierInfo'] = verifierInfo;
      });
  },
});
