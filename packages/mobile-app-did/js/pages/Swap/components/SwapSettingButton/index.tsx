import React, { memo, useCallback, useMemo, useState, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import CommonTooltip from 'components/CommonTooltip';
import CommonTagToggleGroup from 'components/CommonTagToggleGroup';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { priceImpactList } from '@portkey-wallet/constants/constants-ca/awaken';
import { useAwakenUserSlippageTolerance, useAwakenUserExpiration } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';

interface ISwapSettingButtonProps {
  style?: ViewStyleType;
}

const SLIPPAGE_TOLERANCE_INPUT_TAG_KEY = 'Custom';

const SwapSettingContent = () => {
  const { t } = useLanguage();
  const styles = getStyles();
  const { theme } = useTheme();

  const { userSlippageTolerance, update: updateSlippageTolerance } = useAwakenUserSlippageTolerance();
  const { userExpiration, update: updateExpiration } = useAwakenUserExpiration();

  const defaultSlippageToleranceSelectedValue = useMemo(() => {
    return (
      priceImpactList.find(item => item.value === userSlippageTolerance)?.value || SLIPPAGE_TOLERANCE_INPUT_TAG_KEY
    );
  }, [userSlippageTolerance]);

  const [slippageTolerance, setSlippageTolerance] = useState(userSlippageTolerance);
  const [slippageToleranceSelectedValue, setSlippageToleranceSelectedValue] = useState(
    defaultSlippageToleranceSelectedValue,
  );

  const [expiration, setExpiration] = useState(userExpiration);

  const slippageToleranceInputRef = useRef<TextInput>(null);

  const handleSlippageToleranceTagChange = useCallback((value: string) => {
    setSlippageToleranceSelectedValue(value);
    if (value === SLIPPAGE_TOLERANCE_INPUT_TAG_KEY) {
      setSlippageTolerance('0');
      setTimeout(() => {
        slippageToleranceInputRef.current?.focus();
      }, 100);
    } else {
      setSlippageTolerance(value);
    }
  }, []);

  const handleSlippageToleranceInputChange = useCallback((text: string) => {
    const newValue = text.replace(/[^0-9.]/g, '');
    setSlippageTolerance((Number(newValue) / 100).toString());
  }, []);

  const handleExpirationChange = useCallback((text: string) => {
    const newValue = text.replace(/[^0-9]/g, '');
    setExpiration(newValue);
  }, []);

  const saveSetting = useCallback(() => {
    updateSlippageTolerance(slippageTolerance);
    updateExpiration(expiration);
    OverlayModal.hide();
  }, [expiration, slippageTolerance, updateExpiration, updateSlippageTolerance]);

  const displaySlippageTolerance = useMemo(() => {
    if (!slippageTolerance) return '0';
    const percentage = (Number(slippageTolerance) * 100).toFixed(1);
    return percentage.endsWith('.0') ? percentage.slice(0, -2) : percentage;
  }, [slippageTolerance]);

  const slippageToleranceTagList = useMemo(
    () => [
      ...priceImpactList,
      {
        label:
          slippageToleranceSelectedValue === SLIPPAGE_TOLERANCE_INPUT_TAG_KEY ? (
            <Input
              ref={slippageToleranceInputRef}
              containerStyle={styles.slippageToleranceInputContainer}
              inputContainerStyle={styles.slippageToleranceInputContainerStyle}
              inputStyle={styles.slippageToleranceInputStyle}
              maxLength={10}
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="0.0"
              placeholderTextColor={theme.colors.textBrand4}
              rightIcon={<Text style={styles.slippageToleranceUnitText}>%</Text>}
              value={displaySlippageTolerance}
              onChangeText={handleSlippageToleranceInputChange}
            />
          ) : (
            SLIPPAGE_TOLERANCE_INPUT_TAG_KEY
          ),
        value: SLIPPAGE_TOLERANCE_INPUT_TAG_KEY,
        hideCheckIcon: true,
      },
    ],
    [
      displaySlippageTolerance,
      handleSlippageToleranceInputChange,
      slippageToleranceSelectedValue,
      styles,
      theme.colors.textBrand4,
    ],
  );

  return (
    <ModalBody modalBodyType="bottom" title={t('Settings')}>
      <View style={styles.modalContentWrap}>
        <KeyboardSafeArea bottomPad={pTd(16)}>
          <View>
            <View style={styles.labelWrap}>
              <Text style={styles.labelText}>{t('Slippage tolerance')}</Text>
              <CommonTooltip
                tooltipProps={{
                  title: 'Slippage tolerance',
                  description:
                    'Slippage occurs when the price changes between placing and executing your order. If the change exceeds your set slippage tolerance, your trade will not proceed.',
                }}
              />
            </View>
            <CommonTagToggleGroup
              tagList={slippageToleranceTagList}
              selectedValue={slippageToleranceSelectedValue}
              onSelect={handleSlippageToleranceTagChange}
            />
          </View>
          <View style={styles.expiresByWrap}>
            <View style={styles.labelWrap}>
              <Text style={styles.labelText}>{t('Expires by')}</Text>
              <CommonTooltip
                tooltipProps={{
                  title: 'Expires by',
                  description:
                    'Your transaction will execute within the maximum amount of slippage you define for this swap.',
                }}
              />
            </View>
            <View style={styles.expiresByInputWrap}>
              <CommonInput
                containerStyle={styles.expiresByInputContainer}
                type="general"
                maxLength={10}
                autoCorrect={false}
                keyboardType="number-pad"
                placeholder="0"
                value={expiration}
                onChangeText={handleExpirationChange}
              />
              <Text style={styles.expiresByUnitText}>Minute(s)</Text>
            </View>
          </View>
          <CommonButton style={styles.bottomButton} title={t('Done')} type="primary" onPress={saveSetting} />
        </KeyboardSafeArea>
      </View>
    </ModalBody>
  );
};

const showSwapSettingModal = () => {
  OverlayModal.show(<SwapSettingContent />, {
    position: 'bottom',
  });
};

const SwapSettingButton: React.FC<ISwapSettingButtonProps> = ({ style }) => {
  return (
    <Touchable style={style} onPress={() => showSwapSettingModal()}>
      <Svg icon="gear" size={pTd(24)} />
    </Touchable>
  );
};

export default memo(SwapSettingButton);
