/**
 * @file utils/getPromptRoute.js
 * @author hzz780
 * 2020.08.18
 */

import { PromptRouteTypes } from 'messages/InternalMessageTypes';

const routMap: { [x in keyof typeof PromptRouteTypes]?: string } = {
  // SET_PERMISSION: '#/',
  // SET_CONTRACT_PERMISSION: '#/',
  // LOGIN: '#/loginkeypairs',
  // CALL_AELF_CONTRACT: '#/examine-approve',
  // CROSS_SEND: '#/confirmation-cross',
  // CROSS_RECEIVE: '#/confirmation-cross',
  // GET_SIGNATURE: '#/signature',
  [PromptRouteTypes.UNLOCK_WALLET]: '#/unlock',
  [PromptRouteTypes.REGISTER_WALLET]: '#/register',
  [PromptRouteTypes.REGISTER_START_WALLET]: '#/register',
  [PromptRouteTypes.PERMISSION_CONTROLLER]: '#/permission',
  [PromptRouteTypes.SWITCH_CHAIN]: '#/switch-chain',
  [PromptRouteTypes.BLANK_PAGE]: '#/query-page',
  [PromptRouteTypes.CONNECT_WALLET]: '#/connect-wallet',
  [PromptRouteTypes.SEND_TRANSACTION]: '#/send-transactions',
  [PromptRouteTypes.GET_SIGNATURE]: '#/get-signature',
  [PromptRouteTypes.EXPAND_FULL_SCREEN]: '#/',
  [PromptRouteTypes.SETTING]: '#/setting',
  [PromptRouteTypes.ADD_GUARDIANS]: '#/setting/guardians/add',
  [PromptRouteTypes.GUARDIANS_VIEW]: '#/setting/guardians/view',
  [PromptRouteTypes.GUARDIANS_APPROVAL]: '#/setting/wallet-security/manage-devices/guardian-approval',
};

export interface PromptMessage {
  method: keyof typeof routMap;
  search?: string;
}

export default function getPromptRoute({ method, search = '' }: PromptMessage) {
  if (!routMap[method]) throw Error('Can not get router');
  return `${routMap[method]}${search ? '?detail=' + search : ''}`;
}
