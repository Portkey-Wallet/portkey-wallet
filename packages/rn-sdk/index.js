import 'reflect-metadata';
import { initEntries } from './src/global/init/entries';
import { initJsMethodService } from './src/global/init/services';
import { initLanguage } from './src/i18n/index';
import { registerTestModule } from './src/tests/index';

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
