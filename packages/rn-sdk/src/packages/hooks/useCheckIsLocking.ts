import { useAppCommonSelector } from './';

export const useCheckIsLocking = (): Boolean => {
  const { leaveTime, autoLockingTime } = useAppCommonSelector(state => state.settings);

  let result = true;

  if (autoLockingTime === Infinity) return false; // never lock

  if (leaveTime === -Infinity) {
    // first time enter
    result = false;
  } else {
    result = leaveTime + autoLockingTime * 1000 < Date.now();
  }
  return result;
};

export default useCheckIsLocking;
