import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';
import { measurePageY } from 'utils/measure';
import { pTd } from 'utils/unit';
import { ShowChatPopoverParams, showFloatPopover } from './Popover';

export const useOnTouchAndPopUp = (
  params: Pick<
    ShowChatPopoverParams,
    'list' | 'formatType' | 'contentStyle' | 'containerStyle' | 'customPosition' | 'customBounds'
  >,
) => {
  const onTouchAndPopUp = useCallback(
    async (event: GestureResponderEvent) => {
      const { list, formatType = 'dynamicWidth', contentStyle, containerStyle, customPosition, customBounds } = params;
      const { pageY } = event.nativeEvent;
      const top = await measurePageY(event.target);
      showFloatPopover({
        list,
        formatType,
        contentStyle,
        containerStyle,
        customPosition: customPosition || { right: pTd(8), top: (top || pageY) + 30 },
        customBounds: customBounds || { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
      });
    },
    [params],
  );
  return onTouchAndPopUp;
};
