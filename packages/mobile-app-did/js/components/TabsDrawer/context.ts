import { IWebView } from 'components/ProviderWebview';
import { createContext, useContext } from 'react';
import ViewShot from 'react-native-view-shot';

export interface BrowserState {
  setTabRef?: (ref: any) => void;
}
export const BrowserContext = createContext<BrowserState>({});

export function useBrowser(): BrowserState {
  return useContext(BrowserContext);
}

export interface IBrowserTab {
  reload: IWebView['reload'];
  capture?: ViewShot['capture'];
  goBack?: IWebView['goBack'];
  goForward?: IWebView['goForward'];
  goBackHome?: () => void;
}
