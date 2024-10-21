import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';
import { measurePageY } from 'utils/measure';
import { pTd } from 'utils/unit';
import FloatOverlay from './index';
import { ShowChatPopoverParams } from './Popover';

export const useOnTouchAndPopUp = (params: Pick<ShowChatPopoverParams, 'list'>) => {
  const onTouchAndPopUp = useCallback(
    async (event: GestureResponderEvent) => {
      const { list } = params;
      const { pageY } = event.nativeEvent;
      const top = await measurePageY(event.target);
      FloatOverlay.showFloatPopover({
        list,
        formatType: 'dynamicWidth',
        customPosition: { right: pTd(8), top: (top || pageY) + 30 },
        customBounds: { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
      });
    },
    [params],
  );
  return onTouchAndPopUp;
};
