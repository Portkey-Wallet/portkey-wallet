import { DeviceEventEmitter, EmitterSubscription } from 'react-native';

const EventList = [
  'setGuardianStatus',
  'openBiometrics',
  'clearLoginInput',
  'clearSetPin',
  'clearQRWallet',
  'clearSignupInput',
  'refreshGuardiansList',
  'setCountry',
  'refreshDeviceList',
  'nestScrollViewScrolledTop',
  'nestScrollViewLayout',
  'setAuthenticationInfo',
  'refreshMyContactDetailInfo',
] as const;

// eslint-disable-next-line no-new-func
const eventsServer = new Function();

eventsServer.prototype.parseEvent = function (name: string, eventMap: string[]) {
  const obj: any = (this[name] = {});
  eventMap.forEach(item => {
    obj[item] = {
      emit: this.emit.bind(this, item.toLocaleUpperCase()),
      addListener: this.addListener.bind(this, item.toLocaleUpperCase()),
    };
  });
};

eventsServer.prototype.emit = function (eventType: string, ...params: any[]) {
  DeviceEventEmitter.emit(eventType, ...params);
};
eventsServer.prototype.addListener = function (eventType: string, listener: (data: any) => void) {
  return DeviceEventEmitter.addListener(eventType, listener);
};

eventsServer.prototype.parseEvent('base', EventList);

export type MyEventsTypes = {
  [x in typeof EventList[number]]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => EmitterSubscription;
  };
};
const myEvents = eventsServer.prototype.base;

export default myEvents as unknown as MyEventsTypes;
