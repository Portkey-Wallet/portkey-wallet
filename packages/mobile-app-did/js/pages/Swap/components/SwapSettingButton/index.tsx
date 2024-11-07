import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
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

const SwapSettingContent = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const { userSlippageTolerance, update: updateSlippageTolerance } = useAwakenUserSlippageTolerance();
  const { userExpiration, update: updateExpiration } = useAwakenUserExpiration();

  const slippageToleranceTagList = useMemo(
    () => [
      ...priceImpactList,
      {
        label: userSlippageTolerance === '0' ? '0.0%' : 'Custom',
        value: '0',
        hideCheckIcon: true,
      },
    ],
    [userSlippageTolerance],
  );

  const [slippageTolerance, setSlippageTolerance] = useState(userSlippageTolerance);

  const [expiration, setExpiration] = useState(userExpiration);

  const onExpirationChange = useCallback((text: string) => {
    const newValue = text.replace(/[^0-9]/g, '');
    setExpiration(newValue);
  }, []);

  const saveSetting = useCallback(() => {
    updateSlippageTolerance(slippageTolerance);
    updateExpiration(expiration);
    OverlayModal.hide();
  }, [expiration, slippageTolerance, updateExpiration, updateSlippageTolerance]);

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
              selectedValue={slippageTolerance}
              onSelect={setSlippageTolerance}
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
                onChangeText={onExpirationChange}
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
