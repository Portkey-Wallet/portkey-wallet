import { RouteProp, useRoute } from '@react-navigation/native';
import { useState } from 'react';

export default function useRouterParams<T extends object>() {
  const { params } = useRoute<RouteProp<{ params: T }>>();
  const [stateParams] = useState(params);
  return stateParams || ({} as T);
}

export function useRouterEffectParams<T extends object>() {
  const { params } = useRoute<RouteProp<{ params: T }>>();
  return params || ({} as T);
}
