export interface TestContextApi {
  log: (msg?: string | object | null, tag?: string) => void;
  warn: (msg: string) => void;
  error: (msg: string, error?: any) => void;
  assert: (caseName: string, condition: boolean, msg: string) => void;
}
export interface TestCaseApi {
  run: (context: TestContextApi, caseName: string) => Promise<void>;
  describe: string;
  useDetailsReport?: boolean;
}

export type TestReportApi = {
  testAmount: number;
  testsAccepted: number;
  testsFailed: number;
  testExecuted: number;
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
