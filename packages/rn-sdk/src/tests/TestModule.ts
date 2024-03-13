import { NetworkTestCases } from 'tests/network';
import { BaseJSModule, BaseMethodParams, TestCase, TestContext, TestReport } from '../service/JsModules/types';
import { emitJSMethodResult } from '../service/JsModules/SubModules/WalletModule';
import { ContractMethodTestCases } from 'tests/contract';

export const TestCases: Array<TestCase> = [];

export const addTestCases = (testCase: TestCase | Array<TestCase>) => {
  if (Array.isArray(testCase)) {
    TestCases.push(...testCase);
  } else {
    TestCases.push(testCase);
  }
};

if (__DEV__) {
  addTestCases(NetworkTestCases);
  addTestCases(ContractMethodTestCases);
}

export const testRunner = async (): Promise<TestReport> => {
  const testReport: TestReport = {
    testAmount: 0,
    testsAccepted: 0,
    testsFailed: 0,
    details: [],
  };
  const testServices: TestCase[] = TestCases;
  console.log('testServices amount : ', testServices.length);
  for (const testService of testServices) {
    const testContext: TestContext = {
      log: (msg?: string | object | null, tag?: string) => {
        testReport.details[testReport.details.length - 1].logs.push({
          level: 'log',
          msg,
          tag,
        });
      },
      warn: (msg: string) => {
        testReport.details[testReport.details.length - 1].logs.push({
          level: 'warn',
          msg,
        });
      },
      error: (msg: string, error?: any) => {
        testReport.details[testReport.details.length - 1].logs.push({
          level: 'error',
          msg,
        });
        if (error) {
          testReport.details[testReport.details.length - 1].logs.push({
            level: 'error',
            msg: error,
          });
        }
      },
      assert: (condition: boolean, msg: string) => {
        if (!condition) {
          testReport.details[testReport.details.length - 1].logs.push({
            level: 'error',
            msg,
          });
          throw new Error(msg);
        }
      },
    };
    testReport.details.push({
      describe: testService.describe,
      logs: [],
      status: 'success',
    });
    try {
      await testService.run(testContext);
      testReport.testsAccepted += 1;
    } catch (e) {
      console.log('testService.run error : ', e, 'testService : ', testService);
      testReport.testsFailed += 1;
      testReport.details[testReport.details.length - 1].status = 'fail';
    }
    testReport.testAmount += 1;
    if (!testService.useDetailsReport && testReport.details[testReport.details.length - 1].status !== 'fail') {
      testReport.details.pop();
    }
  }
  return testReport;
};

const TestModule: BaseJSModule = {
  runTestCases: async (props: BaseMethodParams) => {
    const { eventId = '' } = props;
    const testReport = await testRunner();
    console.log('testReport : ', JSON.stringify(testReport));
    return emitJSMethodResult(eventId, {
      status: testReport.testAmount === testReport.testsAccepted ? 'success' : 'fail',
      data: testReport,
    });
  },
};

export { TestModule };
