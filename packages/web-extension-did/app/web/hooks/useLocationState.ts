import { useLocation, Path } from 'react-router';

interface CustomLocation<T> extends Path {
  state: T;
  key: string;
}

export default function useLocationState<T>(): CustomLocation<T> {
  const _location = useLocation();
  return _location;
}
