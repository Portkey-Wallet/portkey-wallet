import { useEffect } from 'react';
import { getStoredState, REHYDRATE } from 'redux-persist';
import { useAppDispatch } from './hooks';
import storeConfig from './config';
import { CUSTOM_REHYDRATE, reduxStorageRoot } from 'constants/index';
import { apis } from 'utils/BrowserApis';
import storage from 'utils/storage/storage';

export default function useUpdateRedux() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const addListenerCallback = async (changes: any) => {
      if (storage.reduxStorageName in changes) {
        const { newValue, oldValue } = changes[storage.reduxStorageName];
        const newValueParse = JSON.parse(newValue ?? '{}');
        const oldValueParse = JSON.parse(oldValue ?? '{}');
        const payloadKeys: string[] = [];
        Object.entries(newValueParse).forEach(([key]) => {
          if (newValueParse[key] !== oldValueParse[key]) {
            payloadKeys.push(key);
          }
        });
        const state = await getStoredState(storeConfig.reduxPersistConfig);
        let updateKey = reduxStorageRoot;
        let updateState: any;
        let type: string = REHYDRATE;
        if (payloadKeys.length > 1) {
          updateState = state;
        } else {
          type = CUSTOM_REHYDRATE;
          updateKey = payloadKeys[0];
          updateState = (state as any)[updateKey];
        }
        dispatch({
          type,
          key: updateKey,
          payload: {
            ...updateState,
            _persist: {
              rehydrated: true,
              version: -1,
            },
          },
        });
      }
    };

    apis.storage.onChanged.addListener(addListenerCallback);

    return () => {
      apis.storage.onChanged.removeListener(addListenerCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
