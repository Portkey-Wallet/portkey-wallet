import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { TestCaseApi, TestContextApi, TestReportApi } from 'apiTest/type';
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';
import CustomHeader from 'components/CustomHeader';
import {
  UnLockedWalletTestCases,
  LockedWalletTestCases,
  NoneWalletTestCases,
  ExitWalletCase,
  LockWalletCase,
} from './cases/AccountTest';
import {
  UITestLoginCases,
  UITestAssetsDashboardCases,
  UITestGuardiansManagerCases,
  UITestPaymentSecurityManagerCases,
  UITestScanQRCodeManagerCases,
  UITestSettingsManagerCases,
  UITestUnlockWalletCases,
  UITestSendTokenCases,
  UITestOpenActivityListCases,
  UITestOpenActivityDetailCases,
  UITestOpenRampHomeCases,
} from './cases/UITest';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type TestCasesMapType = {
  [key: string]: Array<TestCaseApi>;
};

// add cases, Two types of cases.
const testCasesMap: TestCasesMapType = {
  // Logic Cases,
  UnLockedWalletTestCases,
  LockedWalletTestCases,
  NoneWalletTestCases,
  LockWalletCase,
  ExitWalletCase,
};
const testUICasesMap: TestCasesMapType = {
  // UI Cases
  UITestLoginCases,
  UITestUnlockWalletCases,
  UITestAssetsDashboardCases,
  UITestGuardiansManagerCases,
  UITestPaymentSecurityManagerCases,
  UITestScanQRCodeManagerCases,
  UITestSettingsManagerCases,
  UITestSendTokenCases,
  UITestOpenActivityListCases,
  UITestOpenActivityDetailCases,
  UITestOpenRampHomeCases,
};

// testCasesKeyList
const testLogicCases = Object.keys(testCasesMap);
const testUICases = Object.keys(testUICasesMap);
const testCases: any[] = [];
testCases.push({ title: true, text: 'Logic' });
testCases.push(...testLogicCases);
testCases.push({ title: true, text: 'UI' });
testCases.push(...testUICases);
const TestEntry = () => {
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [progressText, setProgressText] = useState('0/0');
  const [testReports, setTestReports] = useState<Array<{ testCase: string; result: string; state: number }>>([]);
  const [result, setResult] = useState<TestReportApi>();
  const runTestCase = useCallback((testCase: string) => {
    // reset
    setProgress(0);
    setTestReports([]);
    setProgressText('0/0');
    setResult({
      testAmount: 0,
      testsAccepted: 0,
      testsFailed: 0,
      testExecuted: 0,
      details: [],
    });
    // init
    const testReport: TestReportApi = {
      testAmount: 0,
      testsAccepted: 0,
      testsFailed: 0,
      testExecuted: 0,
      details: [],
    };
    const testContext: TestContextApi = {
      log: (msg?: string | object | null, _tag?: string) => {
        console.log(msg);
      },
      warn: (msg: string) => {
        console.warn(msg);
      },
      error: (msg: string, _error?: any) => {
        console.error(msg);
      },
      assert: (caseName, condition: boolean, msg: string) => {
        // show modal
        if (testCase.includes('UI')) {
          setModalVisible(true);
        }
        if (!condition) {
          // throw new Error(msg);
          testReport.testsFailed++;
          console.warn(msg);
        } else {
          testReport.testsAccepted++;
        }
        testReport.testExecuted++;
        setProgress(testReport.testExecuted / testReport.testAmount);
        setProgressText(`${testReport.testExecuted} / ${testReport.testAmount}`);
        setTestReports(pre => {
          return pre.map(item => {
            if (item.testCase === caseName) {
              return {
                ...item,
                testCase: (condition ? '✅' : '❎') + caseName,
                result: condition ? '' : msg,
                state: condition ? 1 : 2,
              };
            } else {
              return item;
            }
          });
        });
        if (testReport.testExecuted / testReport.testAmount === 1) {
          // finish
          setResult(testReport);
        }
      },
    };
    let testMap;
    if (testCase.includes('UI')) {
      testReport.testAmount = testUICasesMap[testCase].length;
      testMap = testUICasesMap;
    } else {
      testReport.testAmount = testCasesMap[testCase].length;
      testMap = testCasesMap;
    }
    // start test
    testMap[testCase].forEach(testCaseItem => {
      console.log(testCaseItem.describe, 'running...');
      setTestReports(pre => {
        return [
          ...pre,
          {
            testCase: testCaseItem.describe,
            result: 'running...',
            state: 0,
          },
        ];
      });
      Loading.show();
      testCaseItem.run(testContext, testCaseItem.describe).finally(() => {
        Loading.hide();
      });
    });

    // show modal
    if (!testCase.includes('UI')) {
      setModalVisible(true);
    }
  }, []);
  const handleTest = useCallback(
    (testCase: string) => {
      runTestCase(testCase);
    },
    [runTestCase],
  );

  const handleAllTests = () => {
    console.log('Executing all test cases');
    CommonToast.message('unavailable!');
  };
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      return item.title ? (
        <Text style={styles.subTitle}>{item.text}</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => handleTest(item)}>
          <Text style={styles.buttonText}>{item}</Text>
        </TouchableOpacity>
      );
    },
    [handleTest],
  );
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader themeType={'blue'} titleDom={''} />
      <FlatList
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginBottom: 50,
        }}
        data={testCases}
        keyExtractor={item => (item.title ? item.text : item)}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.stickyButton} onPress={handleAllTests}>
        <Text style={styles.buttonText}>Run All Test Cases</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onDismiss={() => {
          setProgress(0);
          setTestReports([]);
          setProgressText('0/0');
        }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalView}>
                <View style={styles.progressView}>
                  <Text>progress ({progressText})</Text>
                  <Progress.Bar progress={progress} width={300} height={20} />
                </View>
                {(result?.testAmount ?? 0) > 0 && (
                  <View style={styles.summaryView}>
                    <Text style={styles.boldText}>Summary</Text>
                    <Text>
                      Total case: <Text style={styles.boldText}>{result?.testAmount}</Text>
                    </Text>
                    <Text>
                      Executed case: <Text style={styles.boldText}>{result?.testExecuted}</Text>
                    </Text>
                    <Text>
                      Failed case: <Text style={styles.boldText}>{result?.testsFailed}</Text>
                    </Text>
                    <Text>
                      Accepted case: <Text style={styles.boldText}>{result?.testsAccepted}</Text>
                    </Text>
                    <Text>
                      Accepted rate:{' '}
                      <Text style={styles.boldText}>
                        {(((result?.testsAccepted ?? 0) / (result?.testExecuted ?? 1)) * 100).toFixed(2)}%
                      </Text>
                    </Text>
                  </View>
                )}
                <FlatList
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    marginTop: 30,
                  }}
                  data={testReports}
                  keyExtractor={item => item.testCase}
                  renderItem={({ item }) => (
                    <Text
                      style={[
                        styles.leftAlignedText,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                          backgroundColor: item.state === 0 ? 'white' : item.state === 1 ? 'white' : 'red',
                        },
                      ]}>
                      {item.testCase} {item.result ? `: ${item.result}` : ''}
                    </Text>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  stickyButton: {
    margin: 10,
    padding: 10,
    backgroundColor: 'dodgerblue',
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    width: screenWidth,
    height: screenHeight * 0.8,
    position: 'absolute',
    bottom: 0,
    marginTop: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  leftAlignedText: {
    textAlign: 'left',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  progressView: {
    flexDirection: 'column',
  },
  summaryView: {
    marginTop: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  subTitle: {
    fontWeight: 'bold',
    marginLeft: 15,
    fontSize: 20,
    color: 'white',
  },
});
export default TestEntry;
