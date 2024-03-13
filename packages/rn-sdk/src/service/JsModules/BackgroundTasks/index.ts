import { AppRegistry } from 'react-native';
import { JsModuleEntries } from '../BatchedBridges';

/**
 * Register all headless tasks from JsModuleEntries.
 *
 * Remember that headless tasks have no module name.
 */
const initHeadlessTasks = () => {
  Object.entries(JsModuleEntries).forEach(([_, module]) => {
    Object.entries(module).forEach(([key, value]) => {
      AppRegistry.registerHeadlessTask(key, () => value);
    });
  });
};

export { initHeadlessTasks };
