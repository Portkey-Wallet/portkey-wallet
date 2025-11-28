import React from 'react';
import { Button, ButtonProps } from '@rneui/themed';
import { styles } from './style';
import { pTd } from 'utils/unit';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import Lottie from 'lottie-react-native';

export type CommonButtonProps = {
  type?: 'solid' | 'clear' | 'outline' | 'primary' | 'transparent' | 'warning' | 'warningNoBorder';
  onPressWithSecond?: number;
  radius?: number;
} & Omit<ButtonProps, 'type'>;
const stylesMap: any = {
  outline: {
    buttonStyle: styles.outlineButtonStyle,
    titleStyle: styles.outlineTitleStyle,
    disabledTitleStyle: styles.outlineDisabledTitleStyle,
  },
  solid: {
    buttonStyle: styles.solidButtonStyle,
    titleStyle: styles.solidTitleStyle,
    disabledStyle: [styles.solidButtonStyle, styles.disabledStyle],
    disabledTitleStyle: styles.primaryTitleStyle,
  },
  clear: {
    buttonStyle: styles.clearButtonStyle,
  },
  primary: {
    buttonStyle: styles.primaryButtonStyle,
    titleStyle: styles.primaryTitleStyle,
    disabledStyle: [styles.primaryButtonStyle, styles.disabledStyle, styles.disabledPrimaryStyle],
    disabledTitleStyle: styles.disabledPrimaryStyle,
  },
  transparent: {
    buttonStyle: styles.transparentButtonStyle,
  },
  warning: {
    buttonStyle: styles.waringButtonStyle,
    titleStyle: styles.warningTitleStyle,
    disabledStyle: styles.waringDisabledStyle,
    disabledTitleStyle: styles.waringDisabledTitleStyle,
  },
  warningNoBorder: {
    buttonStyle: styles.waringNoBorderButtonStyle,
    titleStyle: styles.warningNoBorderTitleStyle,
    disabledStyle: styles.waringNoBorderDisabledStyle,
    disabledTitleStyle: styles.warningNoBorderTitleStyle,
  },
};

const CommonButton: React.FC<CommonButtonProps> = props => {
  const {
    size,
    radius,
    type,
    buttonStyle,
    titleStyle,
    disabledStyle,
    disabledTitleStyle,
    onPress,
    onPressIn,
    onPressWithSecond,
    loading,
    ...buttonProps
  } = props;
  const mapStyles = type ? stylesMap[type] : undefined;

  const handleOnPressIn = useThrottleCallback(onPressIn, [onPressIn], onPressWithSecond);
  const handleOnPress = useThrottleCallback(onPress, [onPress], onPressWithSecond);

  return (
    <Button
      radius={radius || pTd(24)}
      iconPosition="left"
      size="md"
      buttonStyle={[styles.buttonStyle, mapStyles?.buttonStyle, buttonStyle]}
      titleStyle={[styles.titleStyle, mapStyles?.titleStyle, titleStyle]}
      disabledStyle={[styles.disabledStyle, mapStyles?.disabledStyle, disabledStyle]}
      disabledTitleStyle={[styles.disabledTitleStyle, mapStyles?.disabledTitleStyle, disabledTitleStyle]}
      {...buttonProps}
      onPress={onPress ? handleOnPress : undefined}
      onPressIn={onPressIn ? handleOnPressIn : undefined}
      type={
        type === 'primary' || type === 'transparent' || type === 'warning' || type === 'warningNoBorder'
          ? undefined
          : type
      }
      loading={false}>
      {loading ? (
        <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/spinnerDark.json')} autoPlay loop />
      ) : (
        buttonProps.children
      )}
    </Button>
  );
};

export default CommonButton;
