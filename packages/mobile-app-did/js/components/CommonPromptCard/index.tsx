import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { statusBarHeight } from '@portkey-wallet/utils/mobile/device';

export enum PromptCardType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

interface ICommonPromptCardProps {
  type?: PromptCardType;
  title?: string;
  description: React.ReactNode;
  style?: ViewStyle;
}

export const CommonPromptCard: React.FC<ICommonPromptCardProps> = ({
  type = PromptCardType.ERROR,
  title,
  description,
  style,
}) => {
  const styles = getStyles();
  const {
    theme: { colors },
  } = useTheme();
  const iconColor = useMemo(() => {
    switch (type) {
      case PromptCardType.WARNING:
        return colors.iconWarning5;
      case PromptCardType.ERROR:
        return colors.iconDanger3;
      case PromptCardType.INFO:
      default:
        return colors.bgBrand4;
    }
  }, [colors.bgBrand4, colors.iconDanger3, colors.iconWarning5, type]);
  return (
    <View style={[styles.container, styles[`${type}Container`], style]}>
      <Svg iconStyle={styles.icon} color={iconColor} icon="info" size={pTd(22)} />
      <View style={styles.content}>
        {title && <Text style={[styles.title, styles[`${type}Title`]]}>{title}</Text>}
        <Text style={[styles.description, styles[`${type}Description`]]}>{description}</Text>
      </View>
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: pTd(16),
    borderRadius: pTd(16),
    borderWidth: pTd(1),
    borderStyle: 'solid',
  },
  infoContainer: {
    backgroundColor: theme.colors.bgBase1,
    borderColor: theme.colors.borderBase1,
  },
  warningContainer: {
    backgroundColor: theme.colors.bgWarning3,
    borderColor: theme.colors.borderWarning3,
  },
  errorContainer: {
    backgroundColor: theme.colors.bgDanger3,
    borderColor: theme.colors.borderDanger3,
  },
  icon: {
    flexShrink: 0,
    marginRight: pTd(12),
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: pTd(4),
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoTitle: {
    color: theme.colors.textBase1,
  },
  warningTitle: {
    color: theme.colors.textWarning3,
  },
  errorTitle: {
    color: theme.colors.textDanger6,
  },
  description: {
    ...fonts.SGRegularFont,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoDescription: {
    color: theme.colors.textBase2,
  },
  warningDescription: {
    color: theme.colors.textWarning3,
  },
  errorDescription: {
    color: theme.colors.textDanger6,
  },
  top: {
    paddingTop: statusBarHeight + 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: pTd(300),
  },
}));

type TostProps = [text: string, title?: string, duration?: number, icon?: PromptCardType];
const tostProps = {
  overlayOpacity: 0,
  overlayPointerEvents: 'none',
  closeOnHardwareBackPress: false,
  position: 'center',
};

const overlayStyles = StyleSheet.create({
  top: {
    paddingTop: statusBarHeight + 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const show = (...args: TostProps) => {
  const [text, title, duration = 2000, icon] = args;

  const key = Overlay.show(
    <Overlay.View {...tostProps} style={overlayStyles.top}>
      <CommonPromptCard type={icon} title={title} description={text} style={{ width: pTd(300) }} />
    </Overlay.View>,
  );
  setTimeout(() => Overlay.hide(key), duration);
  return key;
};

let element: any;

const CommonPrompt = {
  warn(...args: TostProps) {
    if (!args[3]) args[3] = PromptCardType.WARNING;
    Overlay.hide(element);
    element = show(...args);
  },
  error(...args: TostProps) {
    if (!args[3]) args[3] = PromptCardType.ERROR;
    Overlay.hide(element);
    element = show(...args);
  },
  info(...args: TostProps) {
    if (!args[3]) args[3] = PromptCardType.INFO;
    Overlay.hide(element);
    element = show(...args);
  },
};

export default CommonPrompt;
