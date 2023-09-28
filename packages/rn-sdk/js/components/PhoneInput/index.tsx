import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import CommonInput, { CommonInputProps } from 'components/CommonInput';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { pTd } from 'utils/unit';
import { useFocusEffect } from '@react-navigation/native';

import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';

interface PhoneInputProps extends CommonInputProps {
  selectCountry?: CountryItem;
  onCountryChange?: (country: CountryItem) => void;
}

export default function PhoneInput({ selectCountry, onCountryChange, ...inputProps }: PhoneInputProps) {
  const { t } = useLanguage();

  const timer = useRef<NodeJS.Timeout | null>(null);
  const iptRef = useRef<any>();

  useEffectOnce(() => {
    const countryListener = myEvents.setCountry.addListener((country: CountryItem) => {
      onCountryChange?.(country);
    });
    return () => {
      countryListener.remove();
    };
  });

  useFocusEffect(
    useCallback(() => {
      if (!iptRef || !iptRef?.current) return;
      timer.current = setTimeout(() => {
        iptRef.current.focus();
      }, 200);
    }, []),
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <CommonInput
      ref={iptRef}
      leftIcon={
        <Touchable
          style={inputStyles.countryRow}
          onPress={() => navigationService.navigate('SelectCountry', { selectCountry })}>
          <TextM>+ {selectCountry?.code}</TextM>
          <Svg color={defaultColors.font3} size={12} icon="down-arrow" />
        </Touchable>
      }
      type="general"
      maxLength={30}
      autoCorrect={false}
      keyboardType="number-pad"
      placeholder={t('Enter Phone Number')}
      {...inputProps}
    />
  );
}

export const inputStyles = StyleSheet.create({
  countryRow: {
    height: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: defaultColors.border6,
    borderRightWidth: StyleSheet.hairlineWidth,
    marginLeft: pTd(16),
    paddingRight: pTd(10),
    width: pTd(68),
    justifyContent: 'space-between',
  },
});
