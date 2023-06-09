import type { PortKeyResultType } from 'utils/errorHandler';
type SendResponseParams = PortKeyResultType & { data?: any };
export type SendResponseFun = (response?: SendResponseParams) => void;
export type CreatePromptType = 'tabs' | 'windows';
export type EditType = 'view' | 'edit';

export interface CustomEventType extends Event {
  detail?: string;
}

export type RegisterStatus = undefined | null | 'notRegistered' | 'registeredNotGetCaAddress' | 'Registered';

export type ReCaptchaResponseParams = {
  response?: string;
  error?: number;
  message?: string;
  name?: string;
};

export interface IKeyDownParams {
  key: string;
  preventDefault: () => any;
}
