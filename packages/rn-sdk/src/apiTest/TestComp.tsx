import React from 'react';
import ActionSheet from 'components/ActionSheet';
import Button from 'pages/Login/components/Button';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from 'i18next';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

const TestComp = () => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <SafeAreaView style={styles.container}>
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <Button
        title="ActionSheet show"
        onPress={() =>
          ActionSheet.alert({
            title: t('Authorization failed'),
            message: t('Network error, please switch Portkey app to the matching network.'),
            buttons: [
              {
                title: t('OK'),
                type: 'solid',
              },
            ],
          })
        }
      />
    </SafeAreaView>
  );
};
export default TestComp;
