import { customFetch } from 'packages/utils/fetch';

const baseCMSUrl = 'http://192.168.66.186:1337';
const defaultChainList = '/api/networks';

export const fetchChainList = async () => {
  try {
    const data = await customFetch(`${baseCMSUrl}${defaultChainList}`, {
      params: {
        populate: 'network.nativeCurrency',
      },
    });
    return data;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
