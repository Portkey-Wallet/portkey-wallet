import { useCallback, useMemo } from 'react';
import { useCurrentNetworkInfo } from './network';
import { useCurrentWalletInfo, useOriginChainId } from './wallet';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { setRefreshTokenConfig } from '@portkey-wallet/api/api-did/utils';
import { ActivityModalConfig, TimingType } from '@portkey-wallet/types/types-ca/cms';
import { useCMS } from './cms';

export function useRefreshTokenConfig() {
  const { caHash, AESEncryptPrivateKey } = useCurrentWalletInfo();
  const { connectUrl } = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  return useCallback(
    async (pin?: string) => {
      if (!caHash || !AESEncryptPrivateKey || !pin) return;
      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      if (!privateKey) return;
      const account = AElf.wallet.getWalletByPrivateKey(privateKey);
      return await setRefreshTokenConfig({
        account,
        caHash,
        connectUrl,
        chainId: originChainId,
      });
    },
    [caHash, AESEncryptPrivateKey, connectUrl, originChainId],
  );
}

export function useActivityModalConfig() {
  // todo wfs, from redux get ActivityModalConfig
  const { networkType } = useCurrentNetworkInfo();
  const { activityModalListMap, activityModalListLoaded, currentShowedAcModalListMap } = useCMS();
  console.log('rightTimingConfig activityModalListLoaded', activityModalListLoaded);
  const activityModalList = useMemo(
    () => activityModalListMap?.[networkType] || [],
    [activityModalListMap, networkType],
  );
  const currentShowedAcModalList = useMemo(
    () => currentShowedAcModalListMap?.[networkType] || [],
    [currentShowedAcModalListMap, networkType],
  );
  const currentNetAcModalLoaded = useMemo(
    () => activityModalListLoaded?.[networkType] || false,
    [activityModalListLoaded, networkType],
  );
  // console.log('wfs rightTimingConfig activityModalList', JSON.stringify(cms));
  return useCallback(
    (timingTypeArray: TimingType[], name: string, hookAction: (config: ActivityModalConfig[]) => void) => {
      console.log(
        'getModalConfig params is:',
        timingTypeArray,
        'name',
        name,
        'currentNetAcModalLoaded',
        currentNetAcModalLoaded,
      );
      if (!currentNetAcModalLoaded) {
        return;
      }
      console.log('rightTimingConfig timingTypeArray', JSON.stringify(timingTypeArray), 'timingOperation', name);
      if (name === 'Tab') {
        console.log('rightTimingConfig activityModalList', JSON.stringify(activityModalList));
      }
      const rightTimingConfig = activityModalList
        .filter(item => {
          const isTypeMatched = timingTypeArray.includes(item.timingType);
          if ((item.timingType === TimingType.AppOpen || item.timingType === TimingType.AppOpenOnce) && isTypeMatched) {
            console.log('rightTimingConfig item1', JSON.stringify(item));
            return true;
          }
          if (
            (item.timingType === TimingType.Page || item.timingType === TimingType.Tab) &&
            isTypeMatched &&
            item.timingOperation === name
          ) {
            console.log('rightTimingConfig item2', JSON.stringify(item));
            return true;
          }
          return false;
        })
        .filter(item => !item.showed)
        .filter(item => {
          return currentShowedAcModalList.every(acModal => acModal.id !== item.id);
        });
      console.log('rightTimingConfig result', JSON.stringify(rightTimingConfig));
      if (rightTimingConfig.length > 0) {
        hookAction(rightTimingConfig);
      }
    },
    [activityModalList, currentNetAcModalLoaded, currentShowedAcModalList],
  );
}
