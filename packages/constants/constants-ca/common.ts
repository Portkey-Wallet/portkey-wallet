export type ErrorType = {
  errorMsg: string;
  isError: boolean;
  isWarning?: boolean;
};

export const INIT_ERROR: ErrorType = {
  errorMsg: '',
  isError: false,
};

export const INIT_NONE_ERROR: ErrorType = {
  ...INIT_ERROR,
};

export const INIT_HAS_ERROR: ErrorType = {
  errorMsg: '',
  isError: true,
};

export enum contractStatusEnum {
  MINED = 'MINED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export const HELP_CENTER_URL = 'https://doc.portkey.finance/help';

export const AELF_NETWORK_NAME = 'aelf';
