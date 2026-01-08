import { useAppSelector } from 'store/hooks';

export const useUpdateInfo = () => {
  return useAppSelector(state => state.user.updateInfo);
};
