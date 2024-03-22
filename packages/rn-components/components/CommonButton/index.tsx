import React from 'react';
import { Button, ButtonProps } from '@rneui/themed';
import { useStyles } from './style';
import { pTd } from '../../utils/unit';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useTheme } from '../../theme';

export type CommonButtonProps = {
  buttonType?: 'send' | 'receive';
  type?: 'solid' | 'clear' | 'outline' | 'primary' | 'transparent';
  onPressWithSecond?: number;
} & Omit<ButtonProps, 'type'>;
const stylesMap = (styles: {
  buttonStyle?: { height: number; backgroundColor: string };
  titleStyle?: { color: string; fontSize: number };
  solidButtonStyle: any;
  solidTitleStyle: any;
  outlineTitleStyle: any;
  outlineButtonStyle: any;
  primaryButtonStyle: any;
  primaryTitleStyle: any;
  disabledStyle: any;
  disabledPrimaryStyle: any;
  disabledTitleStyle?: { color: string };
  clearButtonStyle: any;
  transparentButtonStyle: any;
  outlineDisabledTitleStyle: any;
}) => {
  return {
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
      disabledTitleStyle: styles.primaryTitleStyle,
    },
    transparent: {
      buttonStyle: styles.transparentButtonStyle,
    },
  };
};

const CommonButton: React.FC<CommonButtonProps> = props => {
  const {
    type,
    buttonStyle,
    titleStyle,
    disabledStyle,
    disabledTitleStyle,
    onPress,
    onPressIn,
    onPressWithSecond,
    ...buttonProps
  } = props;
  const styles = useStyles();
  const mapStyles = type ? stylesMap(styles)[type] : undefined;

  const handleOnPressIn = useThrottleCallback(onPressIn, [onPressIn], onPressWithSecond);
  const handleOnPress = useThrottleCallback(onPress, [onPress], onPressWithSecond);

  return (
    <Button
      radius={pTd(8)}
      iconPosition="left"
      size="md"
      buttonStyle={[styles.buttonStyle, mapStyles?.buttonStyle, buttonStyle]}
      titleStyle={[styles.titleStyle, mapStyles?.titleStyle, titleStyle]}
      disabledStyle={[styles.disabledStyle, mapStyles?.disabledStyle, disabledStyle]}
      disabledTitleStyle={[styles.disabledTitleStyle, mapStyles?.disabledTitleStyle, disabledTitleStyle]}
      {...buttonProps}
      onPress={onPress ? handleOnPress : undefined}
      onPressIn={onPressIn ? handleOnPressIn : undefined}
      type={type === 'primary' || type === 'transparent' ? undefined : type}
    />
  );
};

export default CommonButton;
