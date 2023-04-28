import React from 'react';
import { StyleSheet, View } from 'react-native';
import CommonInput from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';

export default function Browser() {
  const { t } = useLanguage();

  return (
    <PageContainer safeAreaColor={['blue', 'white']} containerStyles={styles.container}>
      <View style={[BGStyles.bg5, styles.inputContainer]}>
        <CommonInput placeholder={t('Enter URL to explore')} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
});
