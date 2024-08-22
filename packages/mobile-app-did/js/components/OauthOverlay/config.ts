import { stringify } from 'query-string';

export enum TG_FUN {
  LoginCancel = 'tg_loginCancel',
  DeclineRequest = 'tg_declineRequest',
  RequestConfirmation = 'tg_requestConfirmation',
  ConfirmRequest = 'tg_confirmRequest',
  Error = 'tg_error',
  Open = 'tg_open',
}

export enum TON_FUN {
  WalletInfoChange = 'ton_walletInfoChange',
  Error = 'ton_error',
  Open = 'ton_open',
}

export enum FB_FUN {
  Login_Success = 'Login_Success',
  Error = 'fb_error',
}
export const InjectTelegramLoginJavaScript = `(()=>{
  try {
    const tmpConfirmRequest = window.confirmRequest;
    const tmpRequestConfirmation = window.requestConfirmation;
    const tmpDeclineRequest = window.declineRequest;
    const tmpLoginCancel = window.loginCancel;
    window.confirmRequest = (...args)=>{
      tmpConfirmRequest(...args);
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.ConfirmRequest}'}));
    }
    window.requestConfirmation = (...args)=>{
      tmpRequestConfirmation(...args);
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.RequestConfirmation}'}));
    }
    window.declineRequest = (...args)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.DeclineRequest}'}));
    }
    window.loginCancel = (...args)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.LoginCancel}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.Error}',error}));
  }
})()`;

export const InjectTelegramOpenJavaScript = `(()=>{
  try {
    window.open = (url)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({url,type:'${TG_FUN.Open}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.Error}'}));
  }
})()`;

export const InjectFacebookOpenJavaScript = `(()=>{
  try {
    if(!window.Portkey) window.Portkey = {};
    window.Portkey.request = ({method,payload})=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({payload,type:'${FB_FUN.Login_Success}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${FB_FUN.Error}'}));
  }
})()`;

export const InjectTonOpenJavaScript = `(()=>{
  try {
    window.open = (url)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({url,type:'${TON_FUN.Open}'}));
    },   
    window.walletStatusChange = (wallet)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({wallet,type:'${TON_FUN.WalletInfoChange}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.Error}'}));
  }
})()`;

export enum PATHS {
  CallPortkey = '/api/app/telegramAuth/receive/portkey',
  Load = '/social-login/Telegram?from=portkey',
  LoadFB = '/social-login/Facebook',
}

export const TGAuthResult = '#tgAuthResult=';
export const TGAuthPush = 'oauth.telegram.org/auth/push';

export const FBAuthPush = '/api/app/facebookAuth/receive';
export const TGAuthCallBack = 'auth-callback';

export function parseTGAuthResult(url: string) {
  const tgAuthResult = Buffer.from(url.split(TGAuthResult)[1], 'base64').toString('utf8');
  return stringify(JSON.parse(tgAuthResult));
}

export const TelegramUrl = 'tg://resolve?phone=42777';
