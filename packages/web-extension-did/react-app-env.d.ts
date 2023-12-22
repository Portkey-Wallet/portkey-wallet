/// <reference types="react-scripts" />

interface RequestArguments {
  /** The RPC method to request. */
  method: string;

  /** The params of the RPC method, if any. */
  params?: unknown[] | Record<string, unknown>;
}
interface RequestsBack {
  method: string;
  data: any;
  error?: number;
  message?: string | any;
}

type PromiseSend = (input: RequestArguments) => Promise<RequestsBack | undefined | null>;
interface Window {
  portkey?: {
    on: (eventName: string, listener: (...args: any[]) => void) => any;
    // emit: (type: string, ...args: any[]) => boolean;
    removeListener: (eventName: string | symbol, listener: (...args: any[]) => void) => any;
    isConnected: () => boolean;
    request: PromiseSend<RequestArguments>;
    /**  @deprecated will be removed */
    AElf: any;
    CrossChain: any;
  };
}
// interface globalThis {
//   browser?: {};
// }

declare module '*.png';
declare module '*.gif';
declare module 'aelf-sdk';
declare module 'query-string';
