import React, { memo } from 'react';
import { View } from 'react-native';
import AmountCardGroup from '../AmountCardGroup';
import CommonButton from 'components/CommonButton';
import CommonInfoRow from 'components/CommonInfoRow';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import { getStyles } from './style';

const SwapEnter = () => {
  const styles = getStyles();
  return (
    <View style={styles.swapEnterWrap}>
      <View style={styles.contentWrap}>
        <AmountCardGroup style={styles.amountCardGroup} />
        <View style={styles.infoWrap}>
          <CommonInfoRow
            label={{
              text: 'Provider',
              tooltipProps: {
                title: 'Provider',
                description: 'The decentralised exchange where your trade will be executed.',
              },
            }}
            value={{ text: 'AwakenSwap' }}
          />
          <CommonInfoRow label={{ text: 'Price' }} value={{ text: '1 ELF = 0.3794 USDT' }} />
        </View>
        <CommonPromptCard
          style={styles.promptCard}
          type={PromptCardType.ERROR}
          description="There is currently no available liquidity pool for the selected token pair. Select different tokens to continue."
        />
      </View>
      <CommonButton title="Preview" type="primary" />
    </View>
  );
};

export default memo(SwapEnter);
