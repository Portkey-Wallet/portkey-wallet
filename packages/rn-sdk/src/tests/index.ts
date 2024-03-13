import { TestModule } from './TestModule';
import { JSModuleIdentifier } from 'service/JsModules/BatchedBridges';
import { AppRegistry, Platform } from 'react-native';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';

export const registerTestModule = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      Object.entries(TestModule).forEach(([key, value]) => {
        AppRegistry.registerHeadlessTask(key as JSModuleIdentifier, () => value);
      });
    } else {
      BatchedBridge.registerCallableModule(JSModuleIdentifier.TEST_MODULE, TestModule);
    }
  }
};
