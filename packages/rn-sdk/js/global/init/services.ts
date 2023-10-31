import { Platform } from 'react-native';
import { initHeadlessTasks } from 'service/JsModules/BackgroundTasks';
import { initJSBatchedBridgeModules } from 'service/JsModules/BatchedBridges';

const initJsMethodService = () => {
  if (Platform.OS === 'ios') {
    initJSBatchedBridgeModules();
  } else {
    initHeadlessTasks();
  }
};

export { initJsMethodService };
