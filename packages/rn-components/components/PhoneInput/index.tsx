import React, { useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import useEffectOnce from '@portkey-wallet/rn-base/hooks/useEffectOnce';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import Touchable from '../Touchable';
import CommonInput, { CommonInputProps } from '../CommonInput';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import Svg from '../Svg';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { TextM } from '../CommonText';
import { useInputFocus } from '@portkey-wallet/rn-base/hooks/useInputFocus';

interface PhoneInputProps extends CommonInputProps {
  selectCountry?: CountryItem;
  onCountryChange?: (country: CountryItem) => void;
}

export default function PhoneInput({ selectCountry, onCountryChange, ...inputProps }: PhoneInputProps) {
  const { t } = useLanguage();

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);

  useEffectOnce(() => {
    const countryListener = myEvents.setCountry.addListener((country: CountryItem) => {
      onCountryChange?.(country);
    });
    return () => {
      countryListener.remove();
    };
  });

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
