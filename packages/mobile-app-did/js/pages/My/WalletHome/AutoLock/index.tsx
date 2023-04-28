import * as React from 'react';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useAppCASelector } from '@portkey-wallet/hooks';
import { changeLockingTime } from '@portkey-wallet/store/settings/action';
import { pTd } from 'utils/unit';
import ListItem from 'components/ListItem';
import Svg from 'components/Svg';
import SelectOverlay from 'components/SelectOverlay';
import { pageStyles } from './style';

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
  console.log('autoLockingTimeAutoLockingTime', autoLockingTime);

  const { t } = useLanguage();

  return (
    <PageContainer titleDom={t('Auto-Lock')} safeAreaColor={['blue', 'gray']} containerStyles={pageStyles.pageWrap}>
      <ListItem
        title={t(AutoLockList.find(ele => ele.value === autoLockingTime)?.label || '')}
        rightElement={<Svg icon="down-arrow" size={pTd(16)} />}
        onPress={() =>
          SelectOverlay.showSelectModal({
            title: t('Auto-Lock'),
            value: autoLockingTime,
            dataList: AutoLockList,
            onChangeValue: item => {
              dispatch(changeLockingTime({ time: Number(item.value) }));
            },
          })
        }
      />
    </PageContainer>
  );
}
