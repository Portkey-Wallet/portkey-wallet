import { createAction } from '@reduxjs/toolkit';
import { LockingTimeType } from './types';

export const changeLockingTime = createAction<{
  time: LockingTimeType;
}>('settings/changeLockingTime');

export const initLeaveTime = createAction('settings/initLeaveTime');
export const setLeaveTime = createAction('settings/setLeaveTime');
export const reset = createAction('settings/reset');
