import React, { useMemo, memo, useState } from 'react';
import { useLanguage } from 'i18n/hooks';
import { View } from 'react-native';
import AmountCardGroup from '../AmountCardGroup';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import CommonButton from 'components/CommonButton';
import ExpiresSelect from '../ExpiresSelect';
import RateCard from '../RateCard';
import CommonInfoRow from 'components/CommonInfoRow';
import { getStyles } from './style';

const LimitEnter = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const [rate, setRate] = useState('Market');
  const [expires, setExpires] = useState('1');

  const actionButtonTitle = useMemo(() => {
    // if () {
    //   return 'Place limit order'
    // } else if () {
    //   return 'Insufficient ELF balance';
    // } else {
    return 'Preview';
    // }
  }, []);

  return (
    <View style={styles.limitEnterWrap}>
      {/* <AmountCardGroup
        style={styles.amountCardGroup}
        swapInfo={swapInfo}
        setValueIn={setValueIn}
        setValueOut={setValueOut}
        isErrorIn={isInputError}
        balances={currencyBalances}
        setTokenIn={setTokenIn}
        setTokenOut={setTokenOut}
        switchToken={switchToken}
      /> */}
      <CommonPromptCard
        style={styles.promptCard}
        type={PromptCardType.ERROR}
        description="There is currently no available liquidity pool for the selected token pair. Select different tokens to continue."
      />
      <CommonButton style={styles.actionButton} type="primary" title={t(actionButtonTitle)} />
      <RateCard
        style={styles.rateCard}
        symbolIn="ELF"
        symbolOut="USDT"
        amount="0.37995163"
        rate={rate}
        onChangeRate={setRate}
      />
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
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description: "Your trade will be cancelled if it's not completed within the set timeframe.",
            },
          }}
          value={{ content: <ExpiresSelect selectedValue={expires} onChangeValue={setExpires} /> }}
        />
      </View>
    </View>
  );
};

export default memo(LimitEnter);
