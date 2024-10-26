import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

export enum PromptCardType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

interface ICommonPromptCardProps {
  type: PromptCardType;
  title?: string;
  description: React.ReactNode;
}

const CommonPromptCard: React.FC<ICommonPromptCardProps> = ({ type = PromptCardType.ERROR, title, description }) => {
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
    <View style={[styles.container, styles[`${type}Container`]]}>
      <Svg iconStyle={styles.icon} color={iconColor} icon="info" size={pTd(22)} />
      <View style={styles.content}>
        {title && <Text style={[styles.title, styles[`${type}Title`]]}>{title}</Text>}
        <Text style={[styles.description, styles[`${type}Description`]]}>{description}</Text>
      </View>
    </View>
  );
};

export default CommonPromptCard;

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
}));
