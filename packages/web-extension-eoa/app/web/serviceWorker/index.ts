// import ServiceWorkerInstantiate from './ServiceWorkerInstantiate';
import serviceWorkerListener from './serviceWorkerListener';
//
// /**
//  * Initializes the Portkey controller, and sets up all platform configuration.
//  *
//  */
// // async function initialize(remotePort: any) {
// //   console.log(remotePort, 'remotePort===');
// //   new Background();
// // }
//
// // /**
// //  * In case of MV3 we attach a "onConnect" event listener as soon as the application is initialised.
// //  * Reason is that in case of MV3 a delay in doing this was resulting in missing first connect event after service worker is re-activated.
// //  */
//
// // const initApp = async (remotePort: chrome.runtime.Port) => {
// //   console.log(remotePort, 'remotePort===initApp');
// //   apis.runtime.onConnect.removeListener(initApp);
// //   await initialize(remotePort);
// //   console.log('Portkey initialization complete.');
// // };
//
// // apis.runtime.onConnect.addListener(initApp);
// const service = new ServiceWorkerInstantiate();
// new ServiceWorkerInstantiate();
serviceWorkerListener({
  // pageStateChange: ServiceWorkerInstantiate.setPageState,
  pageStateChange: () => {
    console.log('TODO');
  },
  // checkRegisterStatus: service.checkRegisterStatus,
  // checkTimingLock: ServiceWorkerInstantiate.checkTimingLock,
  checkTimingLock: () => {
    console.log('TODO');
  },
});

// MVP only.
self.addEventListener('install', () => {
  console.log('[Service Worker] Installed');
});

self.addEventListener('activate', () => {
  console.log('[Service Worker] Activated');
});
