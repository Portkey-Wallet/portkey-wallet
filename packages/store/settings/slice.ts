import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LockingTimeType, SettingsState } from './types';

const initialState: SettingsState = {
  autoLockingTime: 60,
  leaveTime: -Infinity,
  closeNotificationsModalTime: 0,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeLockingTime: (
      state,
      action: PayloadAction<{
        time: LockingTimeType;
      }>,
    ) => {
      const { time } = action.payload;

      state.autoLockingTime = time;
      state.leaveTime = -Infinity;
    },
    initLeaveTime: state => {
      state.leaveTime = -Infinity;
    },
    // when leave the app
    setLeaveTime: state => {
      console.log('leaver', Date.now());
      state.leaveTime = Date.now();
    },
    addNotificationsModalTime: state => {
      state.closeNotificationsModalTime = (state.closeNotificationsModalTime || 0) + 1;
    },
    resetSettings: state => {
      return { ...initialState, closeNotificationsModalTime: state.closeNotificationsModalTime };
    },
  },
});

export const { changeLockingTime, initLeaveTime, setLeaveTime, addNotificationsModalTime, resetSettings } =
  settingsSlice.actions;

export default settingsSlice;
