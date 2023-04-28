import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import { apis } from 'utils/BrowserApis';

interface PromptConfigParam {
  message: {
    method: keyof typeof PromptRouteTypes;
  };
}
export default async function getPromptConfig({ message }: PromptConfigParam) {
  const windows = await apis.windows.getCurrent();
  const { width: innerWidth, height: innerHeight } = windows;
  const method = message.method;
  let width = undefined;
  let isFullscreen = false;
  switch (method) {
    case PromptRouteTypes.GET_SIGNATURE:
    case PromptRouteTypes.UNLOCK_WALLET:
    case PromptRouteTypes.REGISTER_WALLET:
    case PromptRouteTypes.REGISTER_START_WALLET:
    case PromptRouteTypes.SWITCH_CHAIN:
    case PromptRouteTypes.CONNECT_WALLET:
    case PromptRouteTypes.SIGN_MESSAGE:
    case PromptRouteTypes.EXPAND_FULL_SCREEN:
    case PromptRouteTypes.SETTING:
    case PromptRouteTypes.ADD_GUARDIANS:
    case PromptRouteTypes.GUARDIANS_VIEW:
    case PromptRouteTypes.GUARDIANS_APPROVAL:
      width = undefined;
      isFullscreen = true;
      break;
    default:
      width = undefined;
      break;
  }
  let left;
  let top;
  let height;
  if (width && innerWidth && innerHeight) {
    height = 600;
    left = innerWidth / 2 - width / 2;
    top = innerHeight / 2 - height / 2;
  }
  return {
    height,
    width,
    top,
    left,
    isFullscreen,
  };
}
