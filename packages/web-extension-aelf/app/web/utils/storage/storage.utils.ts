import { ConnectionsType } from 'types/storage';
import { getLocalStorage } from './chromeStorage';

export const getConnections: () => Promise<ConnectionsType> = async () => (await getLocalStorage('connections')) ?? {};
