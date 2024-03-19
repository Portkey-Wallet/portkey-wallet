import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode, useMemo } from 'react';
import CommonSvg from 'components/Svg';
import { blueStyles, hideTitleStyles, whitStyles } from './style/index.style';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import type { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { ViewStyleType } from 'types/styles';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import { PortkeyModulesEntity } from 'service/native-modules';

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
    notHandleHardwareBackPress,
  } = props;
  // theme change
  const styles = themeType === 'blue' ? blueStyles : whitStyles;

  // if can go back
  const isCanGoBack = true;

  const leftIcon = useMemo(() => {
    const isClose = leftIconType === 'close';
    return (
      <CommonSvg
        color={styles.leftBackTitle.color}
        icon={isClose ? 'close2' : 'left-arrow'}
        size={pTd(20)}
        iconStyle={GStyles.marginRight(4)}
      />
    );
  }, [leftIconType, styles.leftBackTitle.color]);
  useHardwareBackPress(
    useMemo(() => {
      if (leftCallback && !notHandleHardwareBackPress) {
        return () => {
          leftCallback();
          return true;
        };
      }
    }, [leftCallback, notHandleHardwareBackPress]),
  );

  const letElement = useMemo(() => {
    if (noLeftDom) return null;
    if (leftDom) return leftDom;
    if (!isCanGoBack && !leftCallback) return null;
    const onPress = leftCallback
      ? leftCallback
      : () => {
          PortkeyModulesEntity.RouterModule.navigateBack(
            {
              status: 'cancel',
              data: {},
            },
            'unknown',
          );
        };
    if (type === 'leftBack') {
      return (
        <TouchableOpacity style={[GStyles.flexRowWrap, GStyles.itemCenter, { padding: pTd(16) }]} onPress={onPress}>
          {leftIcon}
          <TextL style={styles.leftBackTitle}>{t(backTitle)}</TextL>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} style={{ padding: pTd(16) }}>
        {leftIcon}
      </TouchableOpacity>
    );
  }, [backTitle, isCanGoBack, leftCallback, leftDom, leftIcon, noLeftDom, styles.leftBackTitle, t, type]);

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
