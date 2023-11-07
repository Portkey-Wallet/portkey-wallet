import { initEntries, registerLaunchMode } from 'global/init/entries';
import { initJsMethodService } from 'global/init/services';

// init portkey's entry page with their entry name
initEntries();

// register native page launch mode
registerLaunchMode();

// init js services for Android/iOS native
initJsMethodService();
