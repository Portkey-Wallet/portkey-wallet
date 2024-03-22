import React, { memo, ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { pTd } from '../../utils/unit';
import { TextL, TextM, TextS } from '../CommonText';
import Touchable from '../Touchable';
import CommonSwitch from '../CommonSwitch';
import Svg from '../Svg';
import { TextStyleType, Theme, ViewStyleType } from '../../theme/type';
import { makeStyles, useTheme } from '../../theme';

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
  const theme = useTheme();
  const styles = useStyles();
  const RightElement = useMemo(() => {
    if (switching) {
      return (
        <CommonSwitch
          style={switchStyles}
          value={switchValue}
          thumbColor="white"
          trackColor={{ false: '', true: theme.primaryColor }}
          onValueChange={onValueChange}
        />
      );
    }

    return <Svg icon="right-arrow" size={18} color={theme.font7} iconStyle={styles.iconStyle} />;
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
const useStyles = makeStyles((theme: Theme) => {
  return {
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
      color: theme.font3,
    },
    detailsStyle: {
      marginTop: pTd(5),
      color: theme.font3,
    },
    iconStyle: {
      marginTop: pTd(4),
    },
  };
});
