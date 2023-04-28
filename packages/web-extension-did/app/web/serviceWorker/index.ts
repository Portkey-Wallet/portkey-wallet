import ServiceWorkerInstantiate from './ServiceWorkerInstantiate';
import serviceWorkerListener from './serviceWorkerListener';

/**
 * Initializes the MetaMask controller, and sets up all platform configuration.
 *
 * @param {string} remotePort - remote application port connecting to extension.
 */
// async function initialize(remotePort: any) {
//   console.log(remotePort, 'remotePort===');
//   new Background();
// }

// /**
//  * In case of MV3 we attach a "onConnect" event listener as soon as the application is initialised.
//  * Reason is that in case of MV3 a delay in doing this was resulting in missing first connect event after service worker is re-activated.
//  */

// const initApp = async (remotePort: chrome.runtime.Port) => {
//   console.log(remotePort, 'remotePort===initApp');
//   apis.runtime.onConnect.removeListener(initApp);
//   await initialize(remotePort);
//   console.log('Portkey initialization complete.');
// };

// apis.runtime.onConnect.addListener(initApp);
new ServiceWorkerInstantiate();

serviceWorkerListener({
  pageStateChange: ServiceWorkerInstantiate.setPageState,
  checkRegisterStatus: ServiceWorkerInstantiate.checkRegisterStatus,
  checkTimingLock: ServiceWorkerInstantiate.checkTimingLock,
});
