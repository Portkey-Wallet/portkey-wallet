import React, { memo, useCallback, useState } from 'react';
import { Text, View, Image, TouchableWithoutFeedback, ImageSourcePropType } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLanguage } from 'i18n/hooks';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import CommonTooltip, { ITooltipContentProps } from 'components/CommonTooltip';
import { pTd } from 'utils/unit';
import { getStyles } from './style';

interface ISendPreviewProps {
  address: string;
}

const SendPreview: React.FC<ISendPreviewProps> = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(() => {
    setIsLoading(true);
  }, []);

  const renderInfoRow = useCallback(
    (
      label: { text: string; tooltipProps?: ITooltipContentProps; errorText?: string },
      value: { text: string; leftIcon?: ImageSourcePropType; textAbove?: string },
    ) => {
      return (
        <View style={styles.infoRow}>
          <View style={styles.infoLabelColumnWrap}>
            <View style={styles.infoLabelWrap}>
              <Text style={styles.infoLabel}>{label.text}</Text>
              {label.tooltipProps && (
                <CommonTooltip iconStyle={styles.infoLabelHelpIcon} tooltipProps={label.tooltipProps} />
              )}
            </View>
            {label.errorText && <Text style={[styles.infoLabelAbove, styles.infoErrorText]}>{label.errorText}</Text>}
          </View>
          <View style={styles.infoValueColumnWrap}>
            <View style={styles.infoValueWrap}>
              {value.leftIcon && <Image style={styles.infoValueLeftIcon} source={value.leftIcon} />}
              <Text style={[styles.infoValue, label.errorText ? styles.infoErrorText : undefined]}>{value.text}</Text>
            </View>
            {value.textAbove && (
              <Text style={[styles.infoValueAbove, label.errorText ? styles.infoErrorText : undefined]}>
                {value.textAbove}
              </Text>
            )}
          </View>
        </View>
      );
    },
    [styles],
  );

  return (
    <PageContainer
      titleDom={t(`Preview`)}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      rightDom={<Svg iconStyle={styles.headerHelpIcon} icon={isLoading ? 'help-gray' : 'help-white'} size={pTd(24)} />}
      scrollViewProps={{ disabled: true }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View>
            <View style={styles.sendIconWrap}>
              <Svg icon="send-thin" size={pTd(44)} />
            </View>
            <View style={styles.amountInfoWrap}>
              <View style={styles.amountAboveWrap}>
                <Text style={[styles.amountAbove, styles.amountAboveFirst]}>1</Text>
                <Text style={styles.amountAbove}>ELF</Text>
              </View>
              <Text style={styles.amountBelow}>$0.37</Text>
            </View>
            <View style={styles.infoWrap}>
              {renderInfoRow({ text: 'To' }, { text: 'ELF_22FM...xhWb_AELF' })}
              {renderInfoRow(
                { text: 'Destination network' },
                { text: 'aelf MainChain', leftIcon: require('assets/image/pngs/aelf.png') },
              )}
              {renderInfoRow(
                {
                  text: 'Transaction fee',
                  tooltipProps: {
                    title: 'Transaction Fee',
                    description: 'Cost for processing the transaction.',
                  },
                  errorText: 'Not enough ELF',
                },
                { text: '0.0041 ELF', textAbove: '<$0.01' },
              )}
              {renderInfoRow(
                {
                  text: 'Estimated gas fee',
                  tooltipProps: {
                    title: 'Estimated Network Fee',
                    description: 'Cost for network resources to send assets or swap tokens.',
                  },
                },
                { text: '0 ELF', textAbove: '$0' },
              )}
              {renderInfoRow({ text: 'Amount to receive' }, { text: '0.9959 ELF', textAbove: '$0.36' })}
              {renderInfoRow({ text: 'Estimated duration' }, { text: '~4 min' })}
            </View>
            <View style={styles.footerWrap}>
              <Text style={styles.footerText}>Powered by</Text>
              <Svg icon="ETransferLogo" oblongSize={[pTd(70), pTd(12)]} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <CommonButton title="Send" type="primary" loading={isLoading} onPress={handleSend} />
    </PageContainer>
  );
};

export default memo(SendPreview);
