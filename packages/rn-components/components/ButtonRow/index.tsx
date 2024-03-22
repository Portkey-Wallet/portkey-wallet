import CommonButton, { CommonButtonProps } from '../CommonButton';
import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from '../../utils/unit';
import { makeStyles, useTheme } from '../../theme';
import { Theme } from '../../theme/type';

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
  const theme = useTheme();
  const styles = useStyles();
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
            containerStyle.push(theme.marginRight(16));
          }
          return (
            <CommonButton
              disabled={item.disabled}
              loading={item.loading}
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
// const styles = useStyles();
const useStyles = makeStyles((theme: Theme) => {
  return {
    buttonStyle: {
      width: '100%',
      height: pTd(40),
      paddingHorizontal: 0,
    },
    outlineButtonStyle: {
      borderWidth: 1,
      borderColor: theme.border1,
    },
    containerStyle: {
      flex: 1,
    },
    outlineTitleStyle: {
      color: theme.font5,
    },
    buttonItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRightWidth: 1,
      borderRightColor: theme.border1,
      overflow: 'hidden',
    },
    buttonsBox: {
      marginTop: pTd(20),
      flexDirection: 'row',
    },
    titleStyle: {
      width: '100%',
      fontSize: pTd(14),
    },
  };
});
