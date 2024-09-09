export type Json = any;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type HTTPHeaders = {
  [key: string]: string;
};
export type HTTPQuery = {
  [key: string]: string | number | null | boolean | Array<string | number | null | boolean> | HTTPQuery;
};
export type HTTPParams = {
  [key: string]: any;
};
export type HTTPBody = Json | FormData | URLSearchParams;
export interface RequestOpts {
  url?: string;
  method?: HTTPMethod;
  headers?: HTTPHeaders;
  query?: HTTPQuery;
  body?: HTTPBody;
  params?: HTTPParams;
}
export interface IBaseRequest {
  send(config: RequestOpts): Promise<any>;
}
export interface IRequestDefaults {
  headers?: HTTPHeaders;
  baseURL?: string;
  url?: string;
  method?: HTTPMethod;
  timeout?: number;
}

export abstract class BaseService<T = IBaseRequest> {
  protected readonly _request: T;

  public constructor(request: T) {
    this._request = request;
  }
}
