import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';

import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';

interface ToProps {
  selectedToContact: { name: string; address: string };
  setSelectedToContact: (contact: any) => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  setErrorMessage: any;
  isFixedToContact?: boolean;
}

export default function To({
  setErrorMessage,
  selectedToContact,
  setSelectedToContact,
  step,
  setStep,
  isFixedToContact,
}: ToProps) {
  const { t } = useLanguage();

  const clearInput = useCallback(() => {
    setStep(1);
    setSelectedToContact({ address: '', name: '' });
    setErrorMessage?.([]);
  }, [setErrorMessage, setSelectedToContact, setStep]);

  console.log('isFixedToContact', isFixedToContact);

  return (
    <View style={styles.toWrap}>
      <TextM style={styles.leftTitle}>{t('To')}</TextM>

      {!selectedToContact?.name ? (
        <View style={styles.middle}>
          <TextInput
            editable={step === 1}
            style={styles.inputStyle}
            placeholder={t('Address')}
            multiline={true}
            value={selectedToContact?.address || ''}
            onChangeText={v => setSelectedToContact({ name: '', address: v.trim() })}
          />

          {!!selectedToContact?.address && !isFixedToContact && (
            <Touchable style={styles.iconWrap} onPress={() => clearInput()}>
              <Svg icon="clear2" size={pTd(16)} />
            </Touchable>
          )}
        </View>
      ) : (
        <View style={styles.middle}>
          <TextM style={styles.middleTitle}>{selectedToContact?.name || ''}</TextM>
          <TextM style={styles.middleAddress}>{formatStr2EllipsisStr(selectedToContact?.address, 15)}</TextM>
          {!isFixedToContact && (
            <Touchable style={styles.iconWrap} onPress={() => clearInput()}>
              <Svg icon="clear2" size={pTd(16)} />
            </Touchable>
          )}
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  toWrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  leftTitle: {
    width: pTd(49),
    color: defaultColors.font3,
  },
  middle: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  middleTitle: {
    fontSize: pTd(14),
    color: defaultColors.font5,
    lineHeight: pTd(20),
  },
  middleAddress: {
    marginTop: pTd(2),
    width: pTd(235),
    fontSize: pTd(10),
    color: defaultColors.font3,
    lineHeight: pTd(14),
  },
  iconWrap: {
    zIndex: 100,
    position: 'absolute',
    right: 0,
  },
  containerStyle: {
    ...GStyles.marginArg(0),
    ...GStyles.paddingArg(0),
    height: pTd(56),
  },
  inputContainerStyle: {
    borderBottomColor: defaultColors.bg1,
    height: pTd(56),
  },
  inputStyle: {
    color: defaultColors.font5,
    paddingRight: pTd(30),
    fontSize: pTd(12),
  },
  right: {
    width: pTd(16),
  },
});
