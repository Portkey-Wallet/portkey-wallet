export interface BaseJSModule {
  [x: string | symbol]: (params: any) => Promise<void>;
}

export interface BaseMethodParams {
  eventId?: string;
}

export interface BaseMethodResult {
  status: 'success' | 'fail';
  transactionId?: string;
  data?: any;
  error?: any;
}

export interface TestCase {
  run: (context: TestContext) => void | Promise<void>;
  describe: string;
  useDetailsReport?: boolean;
}

export interface TestContext {
  log: (msg?: string | object | null, tag?: string) => void;
  warn: (msg: string) => void;
  error: (msg: string, error?: any) => void;
  assert: (condition: boolean, msg: string) => void;
}

export type TestReport = {
  testAmount: number;
  testsAccepted: number;
  testsFailed: number;
  details: Array<{
    describe: string;
    logs: Array<{
      level: 'log' | 'warn' | 'error';
      msg?: string | object | null;
      tag?: string;
    }>;
    status: 'success' | 'fail';
  }>;
};
