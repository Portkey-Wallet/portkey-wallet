import { initEntries } from 'global/init/entries';
import { initJsMethodService } from 'global/init/services';

// init portkey's entry page with their entry name
initEntries();

// init js services for Android/iOS native
initJsMethodService();
