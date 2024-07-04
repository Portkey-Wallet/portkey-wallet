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
        <Text style={styles.header}>{t('About Key Genie')}</Text>
        <Text style={styles.bodyText}>
          {t(
            'You can chat with me to find more information! You can chat with me to find more information! You can chat with me to find more information!',
          )}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>{t('What can KeyGenie do for you?')}</Text>
        <Text style={styles.bodyText}>
          {t(
            'You can chat with me to find more information! You can chat with me to find more information! You can chat with me to find more information!',
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
