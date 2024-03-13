import useEffectOnce from 'hooks/useEffectOnce';
import { getVerifierData } from 'model/contract/handler';

export const useInitCaches = () => {
  useEffectOnce(() => {
    initCaches();
  });
};

export const initCaches = async () => {
  await initVerifierDataCache();
};

const initVerifierDataCache = async () => {
  return getVerifierData();
};
