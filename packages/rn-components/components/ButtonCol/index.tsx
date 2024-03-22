import CommonButton, { CommonButtonProps } from '../CommonButton';
import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from '../../utils/unit';
import { Theme } from '../../theme/type';
import { makeStyles } from '../../theme';

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
export default function ButtonCol({
  buttonStyle: propsButtonStyle,
  titleStyle: propsTitleStyle,
  buttons,
  style,
}: ButtonRowProps) {
  const styles = useStyles();
  return (
    <View style={[styles.buttonsBox, style]}>
      {Array.isArray(buttons) &&
        buttons.map((item, index) => {
          const buttonStyle: StyleProp<ViewStyle> = [styles.buttonStyle];
          const containerStyle: StyleProp<ViewStyle> = [
            styles.containerStyle,
            index === buttons.length - 1 && styles.lastContainerStyle,
          ];
          const titleStyle: StyleProp<TextStyle> = [styles.titleStyle];
          if (item.type === 'outline') {
            buttonStyle.push(styles.outlineButtonStyle);
            titleStyle.push(styles.outlineTitleStyle);
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
      // TODO: change margin
      width: '100%',
      marginBottom: pTd(8),
    },
    lastContainerStyle: {
      marginBottom: 0,
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
    },
    titleStyle: {
      width: '100%',
      fontSize: pTd(14),
    },
  };
});
