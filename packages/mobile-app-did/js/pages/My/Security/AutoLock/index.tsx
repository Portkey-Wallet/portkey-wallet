import * as React from 'react';
import { ScrollView } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useAppCASelector } from '@portkey-wallet/hooks';
import { changeLockingTime } from '@portkey-wallet/store/settings/action';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useTheme } from '@rneui/themed';
import { getStyles } from './style';
import Touchable from 'components/Touchable';
import { TextL } from 'components/CommonText';

const AutoLockList: { value: number; label: string }[] = [
  {
    value: 0,
    label: 'Immediately',
  },
  {
    value: 15,
    label: 'After 15 seconds',
  },
  {
    value: 60,
    label: 'After 60 seconds',
  },
  {
    value: 300,
    label: 'After 5 minutes',
  },
  {
    value: 600,
    label: 'After 10 minutes',
  },
  {
    value: 86400,
    label: 'Never',
  },
];

export default function InnerSettings() {
  const dispatch = useAppCommonDispatch();
  const { autoLockingTime } = useAppCASelector(state => state.settings);
  const { t } = useLanguage();
  const pageStyles = getStyles();
  const { theme } = useTheme();

  return (
    <PageContainer
      titleDom={t('Auto-Lock')}
      safeAreaColor={['black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ScrollView style={pageStyles.wrapStyle} alwaysBounceVertical={false}>
        {AutoLockList.map(ele => (
          <Touchable
            key={ele.value}
            style={pageStyles.item}
            onPress={() => {
              dispatch(changeLockingTime({ time: Number(ele.value) }));
            }}>
            <TextL>{ele.label}</TextL>
            {autoLockingTime === ele.value && <Svg icon="selected" size={pTd(24)} color={theme.colors.iconBrand2} />}
          </Touchable>
        ))}
      </ScrollView>
    </PageContainer>
  );
}
