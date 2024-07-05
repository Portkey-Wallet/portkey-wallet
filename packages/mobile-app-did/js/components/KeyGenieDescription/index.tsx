import { defaultColors } from 'assets/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const KeyGenieDescription = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>{t('About KeyGenie')}</Text>
        <Text style={styles.bodyText}>
          {t('KeyGenie is your intelligent AI chat companion that elevates your chat experience in Portkey.')}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>{t('What can KeyGenie do')}</Text>
        <Text style={styles.bodyText}>
          {t(
            'Whenever you want a chat or have questions, KeyGenie is here to offer enjoyable interactions and valuable information. Simply dive into a conversation to discover the intelligence and endless possibilities if offers.',
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: pTd(12),
    height: pTd(339),
    paddingVertical: pTd(16),
    backgroundColor: defaultColors.neutralDefaultBG,
    borderRadius: pTd(6),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  section: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: pTd(16),
  },
  header: {
    alignSelf: 'stretch',
    color: defaultColors.primaryTextColor,
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
  bodyText: {
    alignSelf: 'stretch',
    color: defaultColors.neutralSecondaryTextColor,
    fontSize: pTd(12),
    fontWeight: '400',
    lineHeight: pTd(22),
  },
});

export default KeyGenieDescription;
