import { stringify } from 'query-string';

export enum TG_FUN {
  LoginCancel = 'tg_loginCancel',
  DeclineRequest = 'tg_declineRequest',
  Error = 'tg_error',
  Open = 'tg_open',
}
export const InjectTelegramLoginJavaScript = `(()=>{
  try {
    window.declineRequest = ()=>{
      window.ReactNativeWebView.postMessage('${TG_FUN.DeclineRequest}');
    }
    window.loginCancel = ()=>{
      window.ReactNativeWebView.postMessage('${TG_FUN.LoginCancel}');
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage('${TG_FUN.Error}');
  }
})()`;

export const InjectTelegramOpenJavaScript = `(()=>{
  try {
    window.open = (url)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({url,type:'${TG_FUN.Open}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage('${TG_FUN.Error}');
  }
})()`;

export enum PATHS {
  CallPortkey = '/api/app/telegramAuth/receive/portkey',
  Load = '/social-login/Telegram?from=portkey',
}

export const TGAuthResult = '#tgAuthResult=';

export const TGAuthCallBack = 'auth-callback';

export function parseTGAuthResult(url: string) {
  const tgAuthResult = Buffer.from(url.split(TGAuthResult)[1], 'base64').toString('utf8');
  return stringify(JSON.parse(tgAuthResult));
}
