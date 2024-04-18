import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { codePushOperator } from 'utils/update';
import { setUpdateInfo } from './actions';

export const useUpdateInfo = () => {
  return useAppSelector(state => state.user.updateInfo);
};

export const useCheckCodePushUpdate = () => {
  const dispatch = useAppDispatch();
  return useCallback(async () => {
    try {
      const updateInfo = await codePushOperator.showCheckUpdate();
      if (updateInfo) {
        dispatch(setUpdateInfo(updateInfo));
      } else {
        dispatch(setUpdateInfo(undefined));
      }
    } catch (error) {
      dispatch(setUpdateInfo(undefined));
    }
  }, [dispatch]);
};
