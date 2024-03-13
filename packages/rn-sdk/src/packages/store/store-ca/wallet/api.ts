import { request } from 'packages/api/api-did';

export const getChainList = ({ baseUrl }: { baseUrl: string }) => {
  try {
    return request.es.getChainsInfo({ baseURL: baseUrl });
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
