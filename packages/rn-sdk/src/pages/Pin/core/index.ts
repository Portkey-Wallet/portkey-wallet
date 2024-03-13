import { GlobalStorage } from 'service/storage';

export const PIN_STORAGE_KEY = 'PIN_STORAGE_KEY';
export const PIN_LENGTH = 6;

export const setPin = (pin: string) => {
  if (pin.length !== PIN_LENGTH) throw new Error('Invalid pin length');
  GlobalStorage.set(PIN_STORAGE_KEY, pin);
};

// NOT USED NOW
export const headPin = async (pin: string) => {
  if (pin.length !== PIN_LENGTH) throw new Error('Invalid pin length');
  const storedPin = await GlobalStorage.getString(PIN_STORAGE_KEY);
  return storedPin === pin;
};
