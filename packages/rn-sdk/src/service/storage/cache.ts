import { GlobalStorage, TempStorage } from './index';

export interface CacheStrategy<T> {
  getIdentifier: () => Promise<string>;
  getValueIfNonExist: () => Promise<T>;
  valueExpireStrategy?: () => Promise<boolean>;
  target: 'PERMANENT' | 'TEMP';
}

export const handleCachedValue = async <T>(strategy: CacheStrategy<T>): Promise<T> => {
  const { target, getIdentifier, getValueIfNonExist, valueExpireStrategy } = strategy;
  const identifier = await getIdentifier();
  const cache: string | undefined =
    target === 'PERMANENT' ? await GlobalStorage.getString(identifier) : await TempStorage.getString(identifier);
  if (cache && (!valueExpireStrategy || !(await valueExpireStrategy()))) {
    return JSON.parse(cache) as T;
  }
  const value = await getValueIfNonExist();
  if (value) {
    const valueStr = JSON.stringify(value);
    target === 'PERMANENT' ? GlobalStorage.set(identifier, valueStr) : TempStorage.set(identifier, valueStr);
  }
  return value;
};
