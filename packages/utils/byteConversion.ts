export const isHexStr = (str: string) => {
  try {
    return Buffer.from(str, 'hex').toString('hex') === str;
  } catch (error) {
    return false;
  }
};

export const containsPlaceholder = (str: string) => {
  return typeof str === 'string' && str.includes('�');
};

export const tryToUtf8Str = (str: string) => {
  if (isHexStr(str)) {
    const utf8 = Buffer.from(str, 'hex').toString('utf8');
    if (!containsPlaceholder(utf8)) return utf8;
    return str;
  }
  return str;
};

export const valueToString = (v: any) => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return v.toString();
  return JSON.stringify(v);
};

export const showValueToStr = (v: any) => {
  return tryToUtf8Str(valueToString(v));
};
