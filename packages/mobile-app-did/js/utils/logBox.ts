import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
if (!__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.log = () => {};
}
