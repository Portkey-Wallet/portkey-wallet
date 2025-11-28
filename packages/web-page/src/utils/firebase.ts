// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCQVKqZoxl5EPnayYlnyR66-8DCLV7q-Og',
  authDomain: 'aelf-block-explorer.firebaseapp.com',
  projectId: 'aelf-block-explorer',
  storageBucket: 'aelf-block-explorer.appspot.com',
  messagingSenderId: '110395960830',
  appId: '1:110395960830:web:89a856e73017d3967264af',
  measurementId: 'G-H42GV4QSHP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: Analytics;
// only for csr
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const setEvent = (eventName: string, params?: object) => {
  logEvent(analytics, eventName, params);
};
