import React, { memo, ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import CommonSwitch from 'components/CommonSwitch';
import CommonSvg from 'components/Svg';
import { TextStyleType, ViewStyleType } from 'types/styles';

export type ListItemProps = {
  title: string;
  onPress?: () => void;
  subtitle?: string;
  style?: ViewStyleType;
  titleTextStyle?: TextStyleType;
  titleStyle?: ViewStyleType;
  switchStyles?: ViewStyleType;
  subtitleStyle?: ViewStyleType;
  disabled?: boolean;
  details?: string;
  detailsStyle?: ViewStyleType;
  switching?: boolean;
  switchValue?: boolean;
  onValueChange?: (value: boolean) => void;
  rightElement?: ReactNode;
  titleLeftElement?: ReactNode;
};
const ListItem: React.FC<ListItemProps> = props => {
  const {
    title,
    onPress,
    subtitle,
    style,
    titleTextStyle,
    subtitleStyle,
    disabled,
    details,
    detailsStyle,
    switching,
    switchValue,
    onValueChange,
    rightElement,
    switchStyles,
    titleLeftElement,
    titleStyle,
  } = props;
  const RightElement = useMemo(() => {
    if (switching) {
      return (
        <CommonSwitch
          style={switchStyles}
          value={switchValue}
          thumbColor="white"
          trackColor={{ false: '', true: defaultColors.primaryColor }}
          onValueChange={onValueChange}
        />
      );
    }

    return <CommonSvg icon="right-arrow" size={18} color={defaultColors.font7} iconStyle={styles.iconStyle} />;
  }, [switching, switchStyles, switchValue, onValueChange]);
  return (
    <Touchable disabled={disabled} onPress={onPress} style={[styles.container, style]}>
      {details ? (
        <View style={[styles.titleStyle, titleStyle]}>
          {titleLeftElement}
          <TextL numberOfLines={1} style={[titleTextStyle]}>
            {title}
          </TextL>
          <TextS style={[styles.detailsStyle, detailsStyle]}>{details}</TextS>
        </View>
      ) : (
        <View style={[styles.titleStyle, titleStyle]}>
          {titleLeftElement}
          <TextM numberOfLines={1} style={[styles.titleTextStyle, titleTextStyle]}>
            {title}
          </TextM>
        </View>
      )}
      {subtitle ? <TextM style={[styles.subtitleStyle, subtitleStyle]}>{subtitle}</TextM> : null}
      {rightElement !== undefined ? rightElement : RightElement}
    </Touchable>
  );
};
export default memo(ListItem);
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: pTd(56),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    borderRadius: pTd(6),
  },
  titleTextStyle: {
    flex: 1,
    alignSelf: 'center',
    fontSize: pTd(14),
  },
  titleStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleStyle: {
    color: defaultColors.font3,
  },
  detailsStyle: {
    marginTop: pTd(5),
    color: defaultColors.font3,
  },
  iconStyle: {
    marginTop: pTd(4),
  },
});
