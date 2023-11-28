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
