import { useNavigation } from '@portkey-wallet/rn-inject-sdk';
// import { RootStackName } from 'navigation';
import { useCallback } from 'react';

export const useCheckRouteExistInRouteStack = () => {
  const navigation = useNavigation();

  return useCallback(
    (routeName: string) => {
      const routesArr = navigation.getState().routes;
      return routesArr.some(item => item.name === routeName);
    },
    [navigation],
  );
};
