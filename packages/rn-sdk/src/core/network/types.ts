export type TypedUrlParams = { [x: string | symbol]: string | number | boolean | null | undefined };
export enum NetworkResult {
  success = 1,
  failed = -1,
}
export interface IFetch {
  fetch(
    url: string,
    method: string,
    params?: TypedUrlParams,
    headers?: TypedUrlParams,
    extraOptions?: { maxWaitingTime: number },
  ): Promise<{
    status: NetworkResult;
    result?: any;
    code: string;
    message?: string;
  }>;
}