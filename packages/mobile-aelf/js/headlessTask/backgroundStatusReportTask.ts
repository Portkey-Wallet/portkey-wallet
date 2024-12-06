import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import im from '@portkey-wallet/im';

export default function async() {
  return signalrFCM.reportAppStatus(AppStatusUnit.BACKGROUND, im.getMessageCount().unreadCount);
}
