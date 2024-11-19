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
import { isStrictInteger, isValidNumberV2 } from '@portkey-wallet/utils/reg';
import BigNumber from 'bignumber.js';

interface ISwapSettingButtonProps {
  style?: ViewStyleType;
}

const SLIPPAGE_TOLERANCE_INPUT_TAG_KEY = 'Custom';

const SLIPPAGE_TOLERANCE_MAX_VALUE = '99.99';
const SLIPPAGE_TOLERANCE_MIN_VALUE = '0.01';

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

  const [slippageTolerance, setSlippageTolerance] = useState(
    new BigNumber(userSlippageTolerance || '0').multipliedBy(100).toFixed(),
  );
  const [slippageToleranceSelectedValue, setSlippageToleranceSelectedValue] = useState(
    defaultSlippageToleranceSelectedValue,
  );

  const [expiration, setExpiration] = useState(userExpiration);

  const slippageToleranceInputRef = useRef<TextInput>(null);

  const handleSlippageToleranceTagChange = useCallback((value: string) => {
    setSlippageToleranceSelectedValue(value);
    if (value === SLIPPAGE_TOLERANCE_INPUT_TAG_KEY) {
      setSlippageTolerance('');
      setTimeout(() => {
        slippageToleranceInputRef.current?.focus();
      }, 100);
    } else {
      setSlippageTolerance(value);
    }
  }, []);

  const handleSlippageToleranceInputChange = useCallback((text: string) => {
    if (text && !isValidNumberV2(text)) {
      return;
    }

    const value = parseFloat(text);

    if (value > parseFloat(SLIPPAGE_TOLERANCE_MAX_VALUE)) {
      return;
    }

    setSlippageTolerance(text);
  }, []);

  const handleSlippageToleranceInputBlur = useCallback(() => {
    const value = parseFloat(slippageTolerance);
    if (!slippageTolerance || value < parseFloat(SLIPPAGE_TOLERANCE_MIN_VALUE)) {
      setSlippageTolerance(SLIPPAGE_TOLERANCE_MIN_VALUE);
    }
  }, [slippageTolerance]);

  const handleExpirationChange = useCallback((text: string) => {
    if (text && !isStrictInteger(text)) {
      return;
    }
    setExpiration(text);
  }, []);

  const handleExpirationBlur = useCallback(() => {
    if (!expiration) {
      setExpiration('0');
    }
  }, [expiration]);

  const saveSetting = useCallback(() => {
    const slippageValue = new BigNumber(slippageTolerance || SLIPPAGE_TOLERANCE_MIN_VALUE).dividedBy(100).toFixed();
    updateSlippageTolerance(slippageValue);
    updateExpiration(expiration || '0');
    OverlayModal.hide();
  }, [expiration, slippageTolerance, updateExpiration, updateSlippageTolerance]);

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
              maxLength={5}
              autoCorrect={false}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={theme.colors.textBrand4}
              rightIcon={<Text style={styles.slippageToleranceUnitText}>%</Text>}
              value={slippageTolerance}
              onChangeText={handleSlippageToleranceInputChange}
              onBlur={handleSlippageToleranceInputBlur}
            />
          ) : (
            SLIPPAGE_TOLERANCE_INPUT_TAG_KEY
          ),
        value: SLIPPAGE_TOLERANCE_INPUT_TAG_KEY,
        hideCheckIcon: true,
      },
    ],
    [
      slippageTolerance,
      handleSlippageToleranceInputChange,
      handleSlippageToleranceInputBlur,
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
                  description: "Your trade will be cancelled if it's not completed within the set timeframe.",
                }}
              />
            </View>
            <View style={styles.expiresByInputWrap}>
              <CommonInput
                containerStyle={styles.expiresByInputContainer}
                type="general"
                maxLength={5}
                autoCorrect={false}
                keyboardType="number-pad"
                placeholder="0"
                value={expiration}
                onChangeText={handleExpirationChange}
                onBlur={handleExpirationBlur}
              />
              <Text style={styles.expiresByUnitText}>Minute(s)</Text>
            </View>
          </View>
          <CommonButton buttonStyle={styles.bottomButton} title={t('Done')} type="primary" onPress={saveSetting} />
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
