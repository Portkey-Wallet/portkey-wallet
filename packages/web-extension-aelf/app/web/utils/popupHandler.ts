import { MINUTE } from '@portkey-wallet/constants';
import { getLocalStorage, setLocalStorage } from './storage/chromeStorage';

const popupActive = async (): Promise<string | boolean | undefined | void> => {
  const closeTime = await getLocalStorage('popupCloseTime');
  if ((Date.now() - closeTime ?? Date.now()) > 3 * MINUTE) {
    setLocalStorage({ lastLocationState: null });
    return true;
  }
};

const closeHandler = async () =>
  await setLocalStorage({
    popupCloseTime: Date.now(),
  });

export default {
  popupActive,
  closeHandler,
};
