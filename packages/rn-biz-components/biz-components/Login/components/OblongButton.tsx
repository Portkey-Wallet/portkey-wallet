import { defaultCss } from '@portkey-wallet/rn-components/theme/default';
import fonts from '@portkey-wallet/rn-components/theme/fonts';
import { FontStyles } from '@portkey-wallet/rn-components/theme/styles';
// import fonts from 'assets/theme/fonts';
// import { FontStyles } from 'assets/theme/styles';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import Svg, { IconName } from '@portkey-wallet/rn-components/components/Svg';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';

export interface IOblongButton {
  title: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function OblongButton(props: IOblongButton) {
  const { title, icon, onPress, style = {} } = props;

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
      {icon && (
        <View style={styles.iconWrap}>
          <Svg icon={icon} size={pTd(20)} />
        </View>
      )}
      <TextL style={[fonts.mediumFont, FontStyles.font5]}>{title}</TextL>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: pTd(48),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultCss.border1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: pTd(12),
  },
  container: {
    paddingVertical: 6,
    paddingHorizontal: pTd(12),
    borderRadius: 6,
    minHeight: 32,
  },
  titleStyle: {
    lineHeight: pTd(18),
  },
});
