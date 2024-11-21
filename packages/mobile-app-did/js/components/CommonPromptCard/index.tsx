import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import Svg from 'components/Svg';
import Lottie from 'lottie-react-native';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { getStatusBarHeight } from 'utils/statusbar';
import { handleErrorMessage } from '@portkey-wallet/utils';

export enum PromptCardType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  LOADING = 'loading',
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

  const icon = useMemo(() => {
    switch (type) {
      case PromptCardType.LOADING:
        return <Lottie style={styles.icon} source={require('assets/lottieFiles/spinnerWhite.json')} autoPlay loop />;
      case PromptCardType.SUCCESS:
        return <Svg iconStyle={styles.icon} size={pTd(22)} color={colors.iconSuccess1} icon="check-circle" />;
      case PromptCardType.WARNING:
        return <Svg iconStyle={styles.icon} size={pTd(22)} color={colors.iconWarning5} icon="info" />;
      case PromptCardType.ERROR:
        return <Svg iconStyle={styles.icon} size={pTd(22)} color={colors.iconDanger3} icon="info" />;
      case PromptCardType.INFO:
      default:
        return <Svg iconStyle={styles.icon} size={pTd(22)} color={colors.bgBrand4} icon="info" />;
    }
  }, [colors.bgBrand4, colors.iconDanger3, colors.iconSuccess1, colors.iconWarning5, styles.icon, type]);

  return (
    <View style={[styles.container, styles[`${type}Container`], style]}>
      {icon}
      <View style={styles.content}>
        {title && <Text style={[styles.title, styles[`${type}Title`]]}>{title}</Text>}
        <View style={[styles.description, styles[`${type}Description`]]}>{description}</View>
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
  loadingContainer: {
    backgroundColor: theme.colors.bgBase2,
    borderColor: theme.colors.borderBase2,
  },
  successContainer: {
    backgroundColor: theme.colors.bgSuccess3,
    borderColor: theme.colors.borderSuccessHover1,
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
    width: pTd(22),
    height: pTd(22),
    marginRight: pTd(12),
  },
  content: {
    flexShrink: 1,
  },
  title: {
    marginBottom: pTd(4),
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  loadingTitle: {
    color: theme.colors.textBase1,
  },
  successTitle: {
    color: theme.colors.textSuccess6,
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
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  loadingDescription: {
    color: theme.colors.textBase2,
  },
  successDescription: {
    color: theme.colors.textSuccess6,
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
    paddingTop: getStatusBarHeight(),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const show = (...args: TostProps) => {
  const [text, title, duration = 2000, icon] = args;

  const key = Overlay.show(
    <Overlay.View {...tostProps} style={overlayStyles.top}>
      <CommonPromptCard type={icon} title={title} description={text} style={{ maxWidth: pTd(300) }} />
    </Overlay.View>,
  );
  setTimeout(() => Overlay.hide(key), duration);
  return key;
};

let element: any;

const CommonPrompt = {
  loading(...args: TostProps) {
    if (!args[3]) {
      args[3] = PromptCardType.LOADING;
    }
    Overlay.hide(element);
    element = show(...args);
  },
  success(...args: TostProps) {
    if (!args[3]) {
      args[3] = PromptCardType.SUCCESS;
    }
    Overlay.hide(element);
    element = show(...args);
  },
  warn(...args: TostProps) {
    if (!args[3]) {
      args[3] = PromptCardType.WARNING;
    }
    Overlay.hide(element);
    element = show(...args);
  },
  error(...args: TostProps) {
    args[0] = handleErrorMessage(args[0]);
    if (!args[3]) {
      args[3] = PromptCardType.ERROR;
    }
    Overlay.hide(element);
    element = show(...args);
  },
  failError(error: any, errorText?: string, duration?: number) {
    Overlay.hide(element);
    const text = handleErrorMessage(error, errorText);
    if (text) {
      element = show(text, undefined, duration, PromptCardType.ERROR);
    }
  },
  info(...args: TostProps) {
    if (!args[3]) {
      args[3] = PromptCardType.INFO;
    }
    Overlay.hide(element);
    element = show(...args);
  },
};

export default CommonPrompt;
