import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { LayoutAnimation, LayoutAnimationConfig, UIManager } from 'react-native';

if (!isIOS) UIManager.setLayoutAnimationEnabledExperimental?.(true);

const BaseAnimationConfig = {
  duration: 400,
  create: {
    duration: 200,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};

export function nextAnimation(config?: LayoutAnimationConfig) {
  LayoutAnimation.configureNext(config || BaseAnimationConfig);
}
