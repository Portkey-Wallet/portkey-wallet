import signalrFCM from '@portkey-wallet/socket/socket-fcm';

export const initFCMSignalROpen = () => {
  signalrFCM.doOpen({ url: 'http://192.168.66.240:5577' });
};
