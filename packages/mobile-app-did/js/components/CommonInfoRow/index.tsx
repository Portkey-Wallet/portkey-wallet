import React from 'react';
import { Text, View, Image } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonTooltip, { ITooltipContentProps } from 'components/CommonTooltip';
import Svg, { SvgProps } from 'components/Svg';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';

interface ILabel {
  text: string;
  tooltipProps?: ITooltipContentProps;
  textBelow?: string;
}

interface IValue {
  text?: string;
  content?: React.ReactNode;
  leftImageUrl?: string;
  leftSvgName?: SvgProps['icon'];
  textBelow?: string;
}

interface ICommonInfoRowProps {
  label: ILabel;
  value: IValue;
  isError?: boolean;
}

const CommonInfoRow = ({ label, value, isError }: ICommonInfoRowProps) => {
  const { t } = useLanguage();
  const styles = getStyles();

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelColumnWrap}>
        <View style={styles.infoLabelWrap}>
          <Text style={styles.infoLabel}>{t(label.text)}</Text>
          {label.tooltipProps && (
            <CommonTooltip iconStyle={styles.infoLabelHelpIcon} tooltipProps={label.tooltipProps} />
          )}
        </View>
        {label.textBelow && (
          <Text style={[styles.infoLabelBelow, isError ? styles.infoErrorText : undefined]}>{t(label.textBelow)}</Text>
        )}
      </View>
      <View style={styles.infoValueColumnWrap}>
        {value.content || (
          <>
            <View style={styles.infoValueWrap}>
              {value.leftImageUrl ? (
                <Image style={styles.infoValueLeftIcon} source={{ uri: value.leftImageUrl }} />
              ) : (
                value.leftSvgName && <Svg iconStyle={styles.infoValueLeftSvg} icon={value.leftSvgName} size={pTd(18)} />
              )}
              <Text
                style={[styles.infoValue, isError ? styles.infoErrorText : undefined]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {t(value.text || '--')}
              </Text>
            </View>
            {value.textBelow && (
              <Text style={[styles.infoValueBelow, isError ? styles.infoErrorText : undefined]}>{value.textBelow}</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default CommonInfoRow;

export const getStyles = makeStyles(theme => ({
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pTd(16),
  },
  infoLabelColumnWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoLabelWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoLabelHelpIcon: {
    marginLeft: pTd(4),
  },
  infoLabelBelow: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  infoValueColumnWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: pTd(8),
  },
  infoValueWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoValueBelow: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  infoValueLeftIcon: {
    width: pTd(18),
    height: pTd(18),
    marginRight: pTd(4),
  },
  infoValueLeftSvg: {
    marginRight: pTd(4),
  },
  infoErrorText: {
    color: theme.colors.textDanger2,
  },
}));
