import { useNavigation } from '@react-navigation/native';
// import { RootStackName } from 'navigation';
import { useCallback } from 'react';

type RootStackName = string; // todo_wade: add RootStackName type

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
