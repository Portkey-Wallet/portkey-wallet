import 'reflect-metadata';
import 'react-native-get-random-values';
import { initEntries } from './src/global/init/entries';
import { initJsMethodService } from './src/global/init/services';
import { initLanguage } from './src/i18n/index';
import { registerTestModule } from './src/tests/index';
// import { store } from './src/store';
import { store } from '@portkey-wallet/rn-base/store-sdk';
import persistStore from 'redux-persist/es/persistStore';
import Environment from '@portkey-wallet/rn-inject';
import Config from 'react-native-config';
import secureStore from '@portkey-wallet/utils/mobile/secureStore';

Environment.inject({ environment: 'SDK' });
secureStore.init(Config.PORT_KEY_CODE || 'EXAMPLE_PORT_KEY_CODE');
const persistor = persistStore(store);
persistor.subscribe(() => {
  console.log('persist store init success!');
  console.log('wfs second store user', store.getState().user);
});

// we use i18n to translate
initLanguage();

// init portkey's entry page with its entry name
initEntries();

// init js services for Android/iOS native
initJsMethodService();

if (__DEV__) {
  // register test module
  registerTestModule();
}
// export for npm
export * from './src/api';
