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
  'chatHomeListCloseSwiped',
  'navToBottomTab',
  'setLoginAccount',
] as const;

const BookmarkEventList = ['closeSwipeable'] as const;

// eslint-disable-next-line no-new-func
const eventsServer = new Function();

eventsServer.prototype.parseEvent = function (name: string, eventMap: string[]) {
  const obj: any = (this[name] = {});
  eventMap.forEach(item => {
    const eventName = item.toLocaleUpperCase();
    obj[item] = {
      emit: this.emit.bind(this, eventName),
      addListener: this.addListener.bind(this, eventName),
      name: eventName,
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

eventsServer.prototype.parseEvent('bookmark', BookmarkEventList);

export type BookmarkEventsTypes = {
  [x in typeof BookmarkEventList[number]]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => EmitterSubscription;
  };
};

export type MyEventsTypes = {
  [x in typeof EventList[number]]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => EmitterSubscription;
    name: string;
  };
} & {
  bookmark: BookmarkEventsTypes;
};

const myEvents = { ...eventsServer.prototype.base, bookmark: eventsServer.prototype.bookmark };

export default myEvents as unknown as MyEventsTypes;
