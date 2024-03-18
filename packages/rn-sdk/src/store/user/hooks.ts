// import { useCallback } from 'react';
// import { codePushOperator } from 'utils/update';
// import { setUpdateInfo } from './actions';
// import { useRnSDKDispatch, useRnSDKSelector } from 'store';

// export const useUpdateInfo = () => {
//   return useRnSDKSelector(state => state.user.updateInfo);
// };

// export const useCheckCodePushUpdate = () => {
//   const dispatch = useRnSDKDispatch();
//   return useCallback(async () => {
//     try {
//       const updateInfo = await codePushOperator.showCheckUpdate();
//       if (updateInfo) {
//         dispatch(setUpdateInfo(updateInfo));
//       } else {
//         dispatch(setUpdateInfo(undefined));
//       }
//     } catch (error) {
//       dispatch(setUpdateInfo(undefined));
//     }
//   }, [dispatch]);
// };
