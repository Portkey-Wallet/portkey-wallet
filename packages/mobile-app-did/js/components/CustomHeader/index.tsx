import { View, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode, useEffect, useMemo } from 'react';
import Svg from 'components/Svg';
import { blueStyles, hideTitleStyles, whitStyles } from './style/index.style';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import type { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { ViewStyleType } from 'types/styles';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import Touchable from 'components/Touchable';

export type CustomHeaderProps = {
  themeType?: SafeAreaColorMapKeyUnit;
  noLeftDom?: boolean;
  noCenterDom?: boolean;
  leftDom?: ReactNode;
  titleDom?: ReactNode | string;
  rightDom?: ReactNode;
  backTitle?: string;
  leftCallback?: () => void;
  onGestureStartCallback?: () => void;
  type?: 'leftBack' | 'default';
  leftIconType?: 'close' | 'back';
  style?: StyleProp<ViewStyle>;
  notHandleHardwareBackPress?: boolean;
};

const CustomHeader: React.FC<CustomHeaderProps> = props => {
  const { t } = useLanguage();

  const {
    noLeftDom = false,
    noCenterDom = false,
    leftDom = null,
    titleDom = 'title',
    rightDom = null,
    backTitle = 'Back',
    leftCallback,
    type = 'default',
    themeType = 'white',
    style,
    leftIconType = 'back',
    onGestureStartCallback,
    notHandleHardwareBackPress,
  } = props;

  // theme change
  const styles = themeType === 'blue' ? blueStyles : whitStyles;
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // if can go back
  const isCanGoBack = useMemo(() => navigation.canGoBack(), [navigation]);

  const leftIcon = useMemo(() => {
    const isClose = leftIconType === 'close';
    return (
      <Svg
        color={styles.leftBackTitle.color}
        icon={isClose ? 'close2' : 'left-arrow-v2'}
        size={pTd(20)}
        iconStyle={GStyles.marginRight(4)}
      />
    );
  }, [leftIconType, styles.leftBackTitle.color]);
  useHardwareBackPress(
    useMemo(() => {
      if (isFocused && leftCallback && !notHandleHardwareBackPress) {
        return () => {
          leftCallback();
          return true;
        };
      }
    }, [isFocused, leftCallback, notHandleHardwareBackPress]),
  );
  useEffect(() => {
    if (onGestureStartCallback) {
      const unsubscribe = navigation.addListener('gestureStart' as any, () => {
        onGestureStartCallback();
      });
      return unsubscribe;
    }
  }, [navigation, onGestureStartCallback]);

  const letElement = useMemo(() => {
    if (noLeftDom) return null;
    if (leftDom) return leftDom;
    if (!isCanGoBack && !leftCallback) return null;
    const onPress = leftCallback ? leftCallback : () => navigationService.goBack();
    if (type === 'leftBack') {
      return (
        <Touchable style={[GStyles.flexRow, GStyles.itemCenter, styles.leftTitle]} onPress={onPress}>
          {leftIcon}
          <TextL style={styles.leftBackTitle}>{t(backTitle)}</TextL>
        </Touchable>
      );
    }
    return (
      <Touchable onPress={onPress} style={{ padding: pTd(16) }}>
        {leftIcon}
      </Touchable>
    );
  }, [
    backTitle,
    isCanGoBack,
    leftCallback,
    leftDom,
    leftIcon,
    noLeftDom,
    styles.leftBackTitle,
    styles.leftTitle,
    t,
    type,
  ]);

  const centerElement = useMemo(() => {
    if (typeof titleDom === 'string')
      return (
        <TextL numberOfLines={1} style={styles.title}>
          {titleDom}
        </TextL>
      );
    return titleDom;
  }, [styles.title, titleDom]);

  const rightElement = useMemo(() => rightDom, [rightDom]);

  // styles
  const headerStyles = useMemo(() => {
    const hideTitle = typeof titleDom === 'boolean';
    const leftDomWrap: ViewStyleType[] = [styles.leftDomWrap],
      centerWrap: ViewStyleType[] = [styles.centerWrap],
      rightDomWrap: ViewStyleType[] = [styles.rightDomWrap];
    if (hideTitle) {
      leftDomWrap.push(hideTitleStyles.leftDomWrap);
      centerWrap.push(hideTitleStyles.centerWrap);
      rightDomWrap.push(hideTitleStyles.rightDomWrap);
    }
    return { leftDomWrap, centerWrap, rightDomWrap };
  }, [styles.centerWrap, styles.leftDomWrap, styles.rightDomWrap, titleDom]);

  return (
    <View style={[styles.sectionContainer, style]}>
      <View style={headerStyles.leftDomWrap}>{letElement}</View>
      {!noCenterDom && <View style={headerStyles.centerWrap}>{centerElement}</View>}
      <View style={headerStyles.rightDomWrap}>{rightElement}</View>
    </View>
  );
};

export default CustomHeader;
