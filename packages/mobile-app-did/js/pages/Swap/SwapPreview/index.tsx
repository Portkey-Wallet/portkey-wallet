import React, { memo, useCallback, useState } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLanguage } from 'i18n/hooks';
import CommonPreviewContainer from 'components/CommonPreviewContainer';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import CommonInfoRow from 'components/CommonInfoRow';
import Touchable from 'components/Touchable';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChainId } from '@portkey-wallet/types';
import { getChainSvgName } from 'utils';
import { pTd } from 'utils/unit';
import { openOutLink } from 'utils/link';
import { SEND_RECEIVE_HELP_URL } from 'constants/common';
import { getStyles } from './style';

const SwapPreview = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <CommonPreviewContainer
      poweredIcon={<Svg icon="awakenLogo" oblongSize={[pTd(45), pTd(12)]} />}
      buttonProps={{ title: t('Swap'), onPress: handlePress }}
      isLoading={isLoading}>
      <View>
        <CommonInfoRow
          label={{ text: 'Network' }}
          value={{ text: 'aelf dAppChain', leftSvgName: getChainSvgName('tDVV') }}
        />
        <CommonInfoRow label={{ text: 'Price' }} value={{ text: '1 ELF = 0.3794 USDT' }} />
        <CommonInfoRow
          label={{
            text: 'Slippage tolerance',
            tooltipProps: {
              title: 'Slippage tolerance',
              description:
                'Slippage occurs when the price changes between placing and executing your order. If the change exceeds your set slippage tolerance, your trade will not proceed.',
            },
          }}
          value={{ text: '0.3%' }}
        />
        <CommonInfoRow
          label={{
            text: 'Min to receive',
            tooltipProps: {
              title: 'Min to receive',
              description: 'The minimum amount you are guaranteed to receive based on your set slippage tolerance.',
            },
          }}
          value={{ text: '0.005 ELF', textBelow: isMainnet ? '$0.01' : '' }}
        />
        <CommonInfoRow
          label={{
            text: 'Price impact',
            tooltipProps: {
              title: 'Price impact',
              description: "The effect of your trade on the token's price.",
            },
          }}
          value={{ text: '0.82%' }}
        />
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description:
                'Your transaction will execute within the maximum amount of slippage you define for this swap.',
            },
          }}
          value={{ text: 'Oct 1, 2024 at 12:23 am' }}
        />
        <CommonInfoRow
          label={{
            text: 'Transaction fee',
            tooltipProps: {
              title: 'Transaction fee',
              description: 'Fee applied by the decentralised exchange to ensure an optimal experience.',
              learnMoreUrl: 'https://awakenfinance.gitbook.io/en/ii.-trader-faq/what-is-a-swap-trade/what-is-the-fee',
            },
          }}
          value={{ text: '0.0048 ELF', textBelow: isMainnet ? '$0.12' : '' }}
        />
        <CommonInfoRow
          label={{
            text: 'Network fee',
            tooltipProps: {
              title: 'Network fee',
              description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
            },
          }}
          value={{ text: '0.005 ELF', textBelow: isMainnet ? '$0.01' : '' }}
        />
      </View>
      <CommonPromptCard
        style={styles.promptCard}
        type={PromptCardType.INFO}
        description={t(
          'Keep your wallet balance sufficient and avoid editing the authorization amount, or the transaction may fail.',
        )}
      />
    </CommonPreviewContainer>
  );
};

export default memo(SwapPreview);
