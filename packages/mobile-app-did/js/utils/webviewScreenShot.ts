import { captureScreen } from 'react-native-view-shot';

export const takeScreenshot = () =>
  new Promise((resolve, reject) => {
    captureScreen({
      format: 'jpg',
      quality: 0.2,
    }).then(
      uri => {
        console.log('uri', uri);
        // updateTab(tabID, {
        //   url,
        //   image: uri,
        // });
        resolve(true);
      },
      error => {
        // Logger.error(error, `Error saving tab ${url}`);
        reject(error);
      },
    );
  });
