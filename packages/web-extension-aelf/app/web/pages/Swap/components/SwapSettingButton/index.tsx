import React, { useCallback, useMemo, useState, useRef } from 'react';

import { priceImpactList } from '@portkey-wallet/constants/awaken';
import { useAwakenUserSlippageTolerance, useAwakenUserExpiration } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';

import { isStrictInteger, isValidNumberV2 } from '@portkey-wallet/utils/reg';
import { ZERO } from '@portkey-wallet/constants/misc';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { CommonModal, CommonModalTip } from '@portkey/did-ui-react';
import { Button, Input, InputRef } from 'antd';
import { CommonTagToggleGroup } from 'pages/components/CommonTagToggleGroup';
import './index.less';
import clsx from 'clsx';

interface ISwapSettingButtonProps {
  className?: string;
}

const SLIPPAGE_TOLERANCE_INPUT_TAG_KEY = 'Custom';

const SLIPPAGE_TOLERANCE_MAX_VALUE = '99.99';
const SLIPPAGE_TOLERANCE_MIN_VALUE = '0.01';

export const SwapSettingButton = ({ className }: ISwapSettingButtonProps) => {
  const [isShow, setIsShow] = useState(false);

  const { userSlippageTolerance, update: updateSlippageTolerance } = useAwakenUserSlippageTolerance();
  const { userExpiration, update: updateExpiration } = useAwakenUserExpiration();

  const defaultSlippageToleranceSelectedValue = useMemo(() => {
    return (
      priceImpactList.find((item) => item.value === userSlippageTolerance)?.value || SLIPPAGE_TOLERANCE_INPUT_TAG_KEY
    );
  }, [userSlippageTolerance]);

  const [slippageTolerance, setSlippageTolerance] = useState(
    ZERO.plus(userSlippageTolerance || '0')
      .times(100)
      .toFixed(),
  );
  const [slippageToleranceSelectedValue, setSlippageToleranceSelectedValue] = useState(
    defaultSlippageToleranceSelectedValue,
  );

  const onPress = useCallback(() => {
    setSlippageToleranceSelectedValue(defaultSlippageToleranceSelectedValue);
    setSlippageTolerance(
      ZERO.plus(userSlippageTolerance || '0')
        .times(100)
        .toFixed(),
    );
    setIsShow(true);
  }, [defaultSlippageToleranceSelectedValue, userSlippageTolerance]);

  const [expiration, setExpiration] = useState(userExpiration);

  const slippageToleranceInputRef = useRef<InputRef>(null);

  const handleSlippageToleranceTagChange = useCallback((value: string) => {
    setSlippageToleranceSelectedValue(value);
    if (value === SLIPPAGE_TOLERANCE_INPUT_TAG_KEY) {
      setSlippageTolerance('');
      setTimeout(() => {
        slippageToleranceInputRef.current?.focus?.();
      }, 100);
    } else {
      setSlippageTolerance(ZERO.plus(value).times(100).toFixed());
    }
  }, []);

  const handleSlippageToleranceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

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

  const handleExpirationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

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
    const slippageValue = ZERO.plus(slippageTolerance || SLIPPAGE_TOLERANCE_MIN_VALUE)
      .dividedBy(100)
      .toFixed();
    updateSlippageTolerance(slippageValue);
    updateExpiration(expiration || '0');
    setIsShow(false);
  }, [expiration, slippageTolerance, updateExpiration, updateSlippageTolerance]);

  const slippageToleranceTagList = useMemo(
    () => [
      ...priceImpactList,
      {
        label:
          slippageToleranceSelectedValue === SLIPPAGE_TOLERANCE_INPUT_TAG_KEY ? (
            <Input
              className="swap-setting-custom-input"
              ref={slippageToleranceInputRef}
              maxLength={5}
              placeholder="0"
              suffix="%"
              value={slippageTolerance}
              onChange={handleSlippageToleranceInputChange}
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
      handleSlippageToleranceInputBlur,
      handleSlippageToleranceInputChange,
      slippageTolerance,
      slippageToleranceSelectedValue,
    ],
  );

  return (
    <div className={clsx('swap-setting-button-wrap', className)}>
      <CustomSvgV3 className="swap-setting-button" type="gear" onClick={onPress} />

      <CommonModal
        className="swap-setting-modal"
        open={isShow}
        onClose={() => {
          setIsShow(false);
        }}>
        <div className="swap-setting-modal-header">Settings</div>

        <div className="swap-setting-modal-body">
          <div>
            <div className="swap-setting-modal-title-wrap">
              <div className="swap-setting-modal-title">Slippage tolerance</div>
              <CommonModalTip
                title="Slippage tolerance"
                content="Slippage occurs when the price changes between placing and executing your order. If the change exceeds your set slippage tolerance, your trade will not proceed."
              />
            </div>
            <CommonTagToggleGroup
              tagList={slippageToleranceTagList}
              selectedValue={slippageToleranceSelectedValue}
              onSelect={handleSlippageToleranceTagChange}
            />
          </div>

          <div>
            <div className="swap-setting-modal-title-wrap">
              <div className="swap-setting-modal-title">Expires by</div>
              <CommonModalTip
                title="Expires by"
                content="Your trade will be cancelled if it's not completed within the set timeframe."
              />
            </div>
            <div className="swap-setting-modal-expire-input-wrap">
              <Input
                className="swap-setting-modal-expire-input"
                maxLength={5}
                placeholder="0"
                value={expiration}
                onChange={handleExpirationChange}
                onBlur={handleExpirationBlur}
              />
              <div className="swap-setting-modal-expire-input-suffix">{'Minute(s)'}</div>
            </div>
          </div>

          <Button className="swap-setting-modal-save-button" type="primary" onClick={saveSetting}>
            Done
          </Button>
        </div>
      </CommonModal>
    </div>
  );
};
