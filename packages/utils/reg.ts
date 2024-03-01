/* eslint-disable no-useless-escape */
const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
export const websiteRE =
  /[a-zA-Z0-9-.]+\.(com|org|net|int|edu|gov|mil|academy|accountant|accountants|agency|app|associates|bank|biz|blog|box|business|capital|cash|center|city|club|college|community|company|computer|country|credit|creditcard|dev|digital|download|education|enterprises|finance|financial|foo|fund|game|google|gov|global|gmail|guide|help|hotmail|io|law|legal|live|market|marketing|markets|network|news|online|search|site|solutions|storage|tab|tech|technology|website|wiki|xyz|youtube)$/i;
const avatarTypeReg = /\s*(\.jpg|\.png|\.jpeg)$/;

export function isUrl(string: string) {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}

const SYMBOL_REG = /^[A-Za-z0-9]+$/;
export function isSymbol(symbol: string) {
  return SYMBOL_REG.test(symbol);
}

const P_N_REG = /^[0-9]+\.?[0-9]*$/;

export function isValidNumber(n: string) {
  if (n.includes('-')) return false;
  return P_N_REG.test(n);
}

const PASSWORD_REG = /^[a-zA-Z\d! ~@#_^*%/.+:;=\\|,'~{}\[\]]{8,16}$/;

const PIN_REG = /^[a-zA-Z\d! ~@#_^*%/.+:;=\\|,'~{}\[\]]{6,16}$/;

const WALLET_REG = /^[a-zA-Z\d! ~@#_^*%/.+:;=\\|,'~{}[\]]{1,30}$/;

const CA_WALLET_REG = /^[a-zA-Z\d _]{1,16}$/;

export function isValidPassword(password?: string) {
  if (!password) return false;
  return PASSWORD_REG.test(password);
}

export function isValidPin(password?: string) {
  if (!password) return false;
  return PIN_REG.test(password);
}

export function isValidWalletName(walletName?: string) {
  if (!walletName) return false;
  return WALLET_REG.test(walletName);
}

export function isValidCAWalletName(walletName?: string) {
  if (!walletName) return false;
  return CA_WALLET_REG.test(walletName);
}

export function isValidRemark(remark: string) {
  return CA_WALLET_REG.test(remark);
}

export const EmailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export function isValidEmail(email?: string) {
  if (!email) return false;
  return EmailReg.test(email);
}

export const POSITIVE_INTEGER = /^\+?[0-9][0-9]*$/;

export function isValidPositiveInteger(num?: string) {
  if (!num) return false;
  return POSITIVE_INTEGER.test(num);
}

export const Valid_Integer = /^(0*[1-9]\d*)$/;
export function isValidInteger(num?: string) {
  if (!num) return false;
  return Valid_Integer.test(num);
}

export const isValidUrl = (url: string) => {
  var urlRegex = /^(https?|ftp):\/\/(-\.)?([^\s/?\.#]+\.?)+(\/[^\s]*)?$/i;
  return urlRegex.test(url);
};

export const isValidBase58 = (str: string) => {
  return !/[\u4e00-\u9fa5\u3000-\u303f\uff01-\uff5e]/.test(str);
};

export const POTENTIAL_NUMBER = /^(0|[1-9]\d*)(\.\d*)?$/;
export const isPotentialNumber = (str: string) => {
  return POTENTIAL_NUMBER.test(str);
};

export const isValidAvatarFile = (fileName: string) => {
  return avatarTypeReg.test(fileName);
};
