import React from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, Text, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import HistoryCard from './components/HistoryCard';
import { useGetFirstCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';

export default function CryptoGift() {
  const { t } = useLanguage();
  const { firstCryptoGift, loading } = useGetFirstCryptoGift();
  return (
    <PageContainer
      noCenterDom
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <TextXXXL style={[styles.title, FontStyles.size30, GStyles.textAlignCenter]}>Crypto Gifts</TextXXXL>
      <TextM style={[styles.subTitle, FontStyles.neutralSecondaryTextColor, GStyles.textAlignCenter]}>
        Create and share crypto gifts with your friends
      </TextM>
      <Svg icon="gift-box-open" oblongSize={[pTd(343), pTd(240)]} />
      <CommonButton containerStyle={styles.buttonContainer} type="primary" disabled={false}>
        <TextL style={styles.buttonText}>{t('Create Crypto Gifts')}</TextL>
      </CommonButton>
      <HistoryCard
        containerStyle={styles.hsCardContainer}
        showTitle
        redPacketDetail={firstCryptoGift || undefined}
        isSkeleton={loading}
      />
      <View style={styles.noteWrap}>
        <Text style={styles.noteText}>
          {'• 12 as djha aaa sdjh asjd asdja sjda sdj hasd hajs ksdh ajskd hakj sdha asjd'}
        </Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
        <Text style={styles.noteText}>{'• ' + 'asdjhasjd'}</Text>
      </View>
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
  },
  title: {
    marginTop: pTd(16),
  },
  subTitle: {
    marginTop: pTd(8),
    marginBottom: pTd(32),
  },
  buttonContainer: {
    paddingVertical: pTd(32),
  },
  buttonText: {
    lineHeight: pTd(24),
    color: defaultColors.neutralContainerBG,
  },
  noteWrap: {
    width: '100%',
    backgroundColor: defaultColors.neutralHoverBG,
    padding: pTd(12),
    borderRadius: pTd(6),
  },
  noteText: {
    color: defaultColors.font18,
    fontSize: pTd(12),
  },
  hsCardContainer: {
    marginBottom: pTd(16),
  },
});
