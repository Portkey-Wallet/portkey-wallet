import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { TextL } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export interface IOblongButton {
  title: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function OblongButton(props: IOblongButton) {
  const { title, icon, onPress, style = {} } = props;
  const styles = getStyles();

  const outerStyle = useMemo(() => {
    if (Array.isArray(style)) {
      let result = {};
      style.forEach(item => {
        if (typeof item === 'object') {
          result = { ...result, ...item };
        }
      });
      return result;
    }

    return style;
  }, [style]);

  return (
    <Touchable style={[styles.wrap, outerStyle]} onPress={onPress}>
      {icon && <Svg icon={icon} size={pTd(16)} />}
      <TextL style={[fonts.mediumFont, styles.text]}>{title}</TextL>
    </Touchable>
  );
}

const getStyles = makeStyles(theme => ({
  wrap: {
    width: '100%',
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: pTd(1.5),
    borderColor: theme.colors.borderNeutral2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: pTd(6),
    paddingHorizontal: pTd(12),
    borderRadius: pTd(24),
    minHeight: pTd(32),
  },
  titleStyle: {
    lineHeight: pTd(18),
  },
  text: {
    color: theme.colors.textBase1,
    marginLeft: pTd(8),
  },
}));
