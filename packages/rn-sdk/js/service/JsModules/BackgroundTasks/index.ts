import { AppRegistry } from 'react-native';
import { WalletModule } from '../SubModules/WalletModule';

const initHeadlessTasks = () => {
  Object.entries(WalletModule).forEach(([key, value]) => {
    AppRegistry.registerHeadlessTask(key, () => value);
  });
};

export { initHeadlessTasks };
