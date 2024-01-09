import React from 'react';
import { Button, ButtonProps } from '@rneui/themed';
import { styles } from './style';
import { pTd } from 'utils/unit';

export type CommonButtonProps = {
  buttonType?: 'send' | 'receive';
  type?: 'solid' | 'clear' | 'outline' | 'primary' | 'transparent';
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
    disabledTitleStyle: styles.primaryTitleStyle,
  },
  transparent: {
    buttonStyle: styles.transparentButtonStyle,
  },
};

const CommonButton: React.FC<CommonButtonProps> = props => {
  const { type, buttonStyle, titleStyle, disabledStyle, disabledTitleStyle, ...buttonProps } = props;
  const mapStyles = type ? stylesMap[type] : undefined;

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
      type={type === 'primary' || type === 'transparent' ? undefined : type}
    />
  );
};

export default CommonButton;
