import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import { apis } from 'utils/BrowserApis';

interface PromptConfigParam {
  message: {
    method: keyof typeof PromptRouteTypes;
  };
}
const NOTIFICATION_WIDTH = 360;
const NOTIFICATION_HEIGHT = 600 + 18;

export default async function getPromptConfig({ message }: PromptConfigParam) {
  // const windows = await apis.windows.getCurrent();
  // const { width: innerWidth, height: innerHeight } = windows;
  const method = message.method;
  let width;
  let isFullscreen = false;
  let left;
  let top;
  let height;
  const lastFocused = await apis.windows.getLastFocused();
  if (lastFocused.state) isFullscreen = lastFocused.state === 'fullscreen';
  switch (method) {
    case PromptRouteTypes.UNLOCK_WALLET:
    case PromptRouteTypes.REGISTER_WALLET:
    case PromptRouteTypes.REGISTER_START_WALLET:
    case PromptRouteTypes.SWITCH_CHAIN:
    case PromptRouteTypes.EXPAND_FULL_SCREEN:
    case PromptRouteTypes.SETTING:
    case PromptRouteTypes.ADD_GUARDIANS:
    case PromptRouteTypes.GUARDIANS_VIEW:
    case PromptRouteTypes.GUARDIANS_APPROVAL:
    case PromptRouteTypes.GUARDIANS_APPROVAL_PAYMENT_SECURITY:
    case PromptRouteTypes.WALLET_SECURITY_APPROVE:
    case PromptRouteTypes.SEND:
    case PromptRouteTypes.RAMP:
      isFullscreen = true;
      break;
    default:
      break;
  }
  if (!isFullscreen) {
    width = NOTIFICATION_WIDTH;
    height = NOTIFICATION_HEIGHT;
    try {
      top = lastFocused.top;
      left = (lastFocused?.left ?? 0) + ((lastFocused?.width ?? NOTIFICATION_WIDTH) - NOTIFICATION_WIDTH);
    } catch (error) {
      // TODO
      left = NOTIFICATION_WIDTH;
      top = 50;
    }
  }

  return {
    height,
    width,
    top,
    left,
    isFullscreen,
  };
}
