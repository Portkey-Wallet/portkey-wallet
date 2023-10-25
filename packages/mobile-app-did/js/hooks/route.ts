import { useNavigation } from '@react-navigation/native';
import { RootStackName } from 'navigation';
import { useCallback } from 'react';

export const useCheckRouteExistInRouteStack = () => {
  const navigation = useNavigation();

  return useCallback(
    (routeName: RootStackName) => {
      const routesArr = navigation.getState().routes;
      return routesArr.some(item => item.name === routeName);
    },
    [navigation],
  );
};
