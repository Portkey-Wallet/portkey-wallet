import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { pTd } from 'utils/unit';

export const SwitchTabsContent: React.FC = props => {
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const closeAllTabs = () => {
    dispatch;
  };

  return (
    <View>
      <ScrollView>
        <TextM>hello</TextM>
      </ScrollView>
      <View style={styles.handleActionWrap}>
        <TextM style={styles.handleActionItem} onPress={closeAllTabs}>
          {t('Close All')}
        </TextM>
        <TouchableOpacity style={styles.handleActionItem}>
          <Svg icon="add1" size={pTd(18)} />
        </TouchableOpacity>
        <TextM style={styles.handleActionItem}>{t('done')}</TextM>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  handleActionWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handleActionItem: {
    flex: 1,
  },
});
