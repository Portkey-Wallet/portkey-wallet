import React, { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonPreviewContainer from 'components/CommonPreviewContainer';
import Svg from 'components/Svg';
import CommonInfoRow from 'components/CommonInfoRow';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import PreviewAmountCard from '../components/PreviewAmountCard';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getChainSvgName } from 'utils';
import { pTd } from 'utils/unit';
import { getStyles } from './style';

const SwapPreview = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const [isSwapping, setIsSwapping] = useState(false);

  const handlePress = useCallback(() => {
    setIsSwapping(true);
  }, []);

  return (
    <CommonPreviewContainer
      footerStyle={styles.footerWrap}
      poweredIcon={<Svg icon="awakenLogo" oblongSize={[pTd(45), pTd(12)]} />}
      buttonProps={{ title: t('Swap'), onPress: handlePress }}
      isLoading={isSwapping}>
      {/* <PreviewAmountCard style={styles.previewAmountCard} swapInfo={swapInfo} /> */}
      <View style={styles.infoRowContainer}>
        <CommonInfoRow
          label={{ text: 'Network' }}
          value={{ text: 'aelf dAppChain', leftSvgName: getChainSvgName('tDVV') }}
        />
        <CommonInfoRow label={{ text: 'Limit price' }} value={{ text: '1 ELF = 0.3794 USDT' }} />
        <CommonInfoRow
          label={{
            text: 'Expires by',
            tooltipProps: {
              title: 'Expires by',
              description:
                'Your transaction will execute within the maximum amount of slippage you define for this swap.',
            },
          }}
          value={{ text: '1 day' }}
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
