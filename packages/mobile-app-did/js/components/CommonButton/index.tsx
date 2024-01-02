import React from 'react';
import { Button, ButtonProps } from '@rneui/themed';
import { styles } from './style';
import { pTd } from 'utils/unit';

export type CommonButtonProps = {
  buttonType?: 'send' | 'receive';
  type?: 'solid' | 'clear' | 'outline' | 'primary' | 'text';
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
  text: {
    buttonStyle: styles.textButtonStyle,
    titleStyle: styles.textTitleStyle,
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
      type={type === 'primary' || type === 'text' ? undefined : type}
    />
  );
};

export default CommonButton;
