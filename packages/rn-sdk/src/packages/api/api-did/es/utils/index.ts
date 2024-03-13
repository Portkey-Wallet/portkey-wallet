import { request } from 'packages/api/api-did';
import { GetContractListApiType } from 'packages/types/types-ca/contact';
import { IGetContactListParams } from '../type';

export const getContactList = (
  baseURL: string,
  { page, size, modificationTime, keyword }: IGetContactListParams,
): Promise<GetContractListApiType> => {
  return request.es.getContactList({
    baseURL,
    params: {
      filter: `modificationTime: [* TO ${modificationTime}] AND isDeleted: false`,
      sort: 'modificationTime',
      sortType: 0,
      skipCount: (page - 1) * size,
      maxResultCount: size,
      keyword,
    },
  });
};

export const getContactEventList = (
  baseURL: string,
  { page, size, modificationTime, fetchTime, keyword }: IGetContactListParams & { fetchTime: string },
): Promise<GetContractListApiType> => {
  return request.es.getContactList({
    baseURL,
    params: {
      filter: `modificationTime: [${modificationTime} TO ${fetchTime}]`,
      sort: 'modificationTime',
      sortType: 0,
      skipCount: (page - 1) * size,
      maxResultCount: size,
      keyword,
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
