import { BASE_APIS, BASE_REQ_TYPES, DEFAULT_METHOD, EXPAND_APIS, EXPAND_REQ_TYPES } from './list';
import myServer from './server';
import { IBaseRequest } from './types';
import { spliceUrl, service } from './utils';

function baseRequest({ url, method = DEFAULT_METHOD, query = '', ...c }: IBaseRequest) {
  return service({
    ...c,
    url: spliceUrl(url, query),
    method,
  });
}

myServer.parseRouter('base', BASE_APIS);

Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  myServer.parseRouter(key, value);
});

export type RequestType = BASE_REQ_TYPES & EXPAND_REQ_TYPES;

const request: RequestType = Object.assign({}, myServer.base, myServer);

export { baseRequest, request };
