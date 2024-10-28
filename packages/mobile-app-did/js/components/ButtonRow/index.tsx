import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export type ButtonRowProps = {
  buttons?: {
    onPress?: () => void;
    type?: CommonButtonProps['type'];
    title: string;
    loading?: CommonButtonProps['loading'];
    disabled?: boolean;
  }[];
  style?: StyleProp<ViewStyle>;
} & CommonButtonProps;
export default function ButtonRow({
  buttonStyle: propsButtonStyle,
  titleStyle: propsTitleStyle,
  buttons,
  style,
}: ButtonRowProps) {
  const styles = getStyles();

  return (
    <View style={[styles.buttonsBox, style]}>
      {Array.isArray(buttons) &&
        buttons.map((item, index) => {
          const isLastItem = index === buttons.length - 1;
          const buttonStyle: StyleProp<ViewStyle> = [styles.buttonStyle];
          const containerStyle: StyleProp<ViewStyle> = [styles.containerStyle];
          const titleStyle: StyleProp<TextStyle> = [styles.titleStyle];
          if (item.type === 'outline') {
            buttonStyle.push(styles.outlineButtonStyle);
            titleStyle.push(styles.outlineTitleStyle);
          }
          if (!isLastItem) {
            containerStyle.push(GStyles.marginRight(16));
          }
          return (
            <CommonButton
              disabled={item.disabled}
              loading={item.loading}
              loadingProps={item.type === 'outline' ? { color: defaultColors.primaryColor } : undefined}
              containerStyle={containerStyle}
              buttonStyle={[buttonStyle, propsButtonStyle]}
              titleStyle={[titleStyle, propsTitleStyle]}
              onPress={item.onPress}
              type={item.type || 'primary'}
              key={index}
              title={item.title}
            />
          );
        })}
    </View>
  );
}

export const getStyles = makeStyles(theme => ({
  buttonStyle: {
    width: '100%',
    height: pTd(48),
    paddingHorizontal: 0,
  },
  outlineButtonStyle: {
    borderWidth: 1,
    borderColor: theme.colors.borderNeutral2,
  },
  containerStyle: {
    flex: 1,
  },
  outlineTitleStyle: {
    color: theme.colors.textBase1,
  },
  buttonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: defaultColors.border1,
    overflow: 'hidden',
  },
  buttonsBox: {
    marginTop: pTd(24),
    flexDirection: 'row',
  },
  titleStyle: {
    width: '100%',
    fontSize: pTd(14),
  },
}));
