import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import Touchable from 'components/Touchable';
import Svg, { SvgProps } from 'components/Svg';
import CommonButton from 'components/CommonButton';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { openOutLink } from 'utils/link';

export interface ITooltipContentProps {
  title: string;
  description: string;
  learnMoreUrl?: string;
}

interface ICommonTooltipProps {
  iconStyle?: SvgProps['iconStyle'];
  iconSize?: number;
  tooltipProps?: ITooltipContentProps;
}

const TooltipContent = ({ title, description, learnMoreUrl }: ITooltipContentProps) => {
  const { t } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const styles = getStyles();
  return (
    <ModalBody style={styles.modalBody} modalBodyType="center">
      <View style={styles.header}>
        <Text style={styles.title}>{t(title)}</Text>
        <Touchable onPress={() => OverlayModal.hide()}>
          <Svg icon="close3" size={pTd(20)} color={colors.iconBase1} />
        </Touchable>
      </View>
      <View>
        <Text style={styles.description}>
          {t(description)}
          {learnMoreUrl && (
            <>
              {' '}
              <Touchable
                onPress={async () => {
                  await openOutLink(learnMoreUrl);
                }}>
                <Text style={styles.learnMore}>{t('Learn more')}</Text>
              </Touchable>
              .
            </>
          )}
        </Text>
      </View>
      <CommonButton title={t('OK')} type="primary" onPress={() => OverlayModal.hide()} />
    </ModalBody>
  );
};

const showTooltip = (props: ITooltipContentProps) => {
  OverlayModal.show(<TooltipContent {...props} />, {
    position: 'center',
  });
};

const CommonTooltip = ({ iconStyle, iconSize = pTd(16), tooltipProps }: ICommonTooltipProps) => {
  return (
    <Touchable onPress={tooltipProps && (() => showTooltip(tooltipProps))}>
      <Svg iconStyle={iconStyle} icon="help-gray" size={iconSize} />
    </Touchable>
  );
};

export default memo(CommonTooltip);

const getStyles = makeStyles(theme => ({
  modalBody: {
    marginRight: pTd(24),
    marginLeft: pTd(24),
    padding: pTd(16),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
    borderRadius: pTd(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(12),
  },
  title: {
    ...fonts.BGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(20),
    lineHeight: pTd(24),
  },
  description: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
    marginBottom: pTd(24),
  },
  learnMore: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBrand1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
    transform: [{ translateY: pTd(2) }],
  },
}));
