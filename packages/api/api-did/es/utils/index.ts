import { request } from '@portkey-wallet/api/api-did';
import { GetContractListApiType } from '@portkey-wallet/types/types-ca/contact';

export const getContactList = (
  baseURL: string,
  { page, size, modificationTime }: { page: number; size: number; modificationTime: string },
): Promise<GetContractListApiType> => {
  return request.es.getContactList({
    baseURL,
    params: {
      filter: `modificationTime: [* TO ${modificationTime}] AND isDeleted: false`,
      sort: 'modificationTime',
      sortType: 0,
      skipCount: (page - 1) * size,
      maxResultCount: size,
    },
  });
};

export const getContactEventList = (
  baseURL: string,
  {
    page,
    size,
    modificationTime,
    fetchTime,
  }: { page: number; size: number; modificationTime: string; fetchTime: string },
): Promise<GetContractListApiType> => {
  return request.es.getContactList({
    baseURL,
    params: {
      filter: `modificationTime: [${modificationTime} TO ${fetchTime}]`,
      sort: 'modificationTime',
      sortType: 0,
      skipCount: (page - 1) * size,
      maxResultCount: size,
    },
  });
};

export const getCaHolder = (
  baseURL: string,
  { caHash }: { caHash: string },
): Promise<{
  items: Array<{
    userId: string;
    caAddress: string;
    caHash: string;
    id: string;
    nickName: string;
  }>;
}> => {
  return request.es.getCaHolder({
    baseURL,
    params: {
      filter: `caHash: ${caHash}`,
    },
  });
};
