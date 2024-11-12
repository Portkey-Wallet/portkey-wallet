import React, { memo, useMemo, useState } from 'react';
import { useLanguage } from 'i18n/hooks';
import CommonTopTabWithoutContent from 'components/CommonTopTabWithoutContent';
import PageContainer from 'components/PageContainer';
import SwapEnter from '../components/SwapEnter';
import LimitEnter from '../components/LimitEnter';
import SwapSettingButton from '../components/SwapSettingButton';
import { getStyles } from './style';
import { useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';

enum SwapHomeTabType {
  SWAP = 'Swap',
  LIMIT = 'Limit',
}

const SwapHome = () => {
  const { t } = useLanguage();
  const styles = getStyles();
  useAwakenTokenList(true);

  const [selectTab, setSelectTab] = useState<SwapHomeTabType>(SwapHomeTabType.SWAP);
  const tabList = useMemo(() => {
    return [
      {
        name: t('Swap'),
        key: SwapHomeTabType.SWAP,
      },
      {
        name: t('Limit'),
        key: SwapHomeTabType.LIMIT,
      },
    ];
  }, [t]);

  return (
    <PageContainer
      titleDom={<CommonTopTabWithoutContent tabList={tabList} selectTab={selectTab} onTabPress={setSelectTab} />}
      rightDom={selectTab === SwapHomeTabType.SWAP && <SwapSettingButton style={styles.swapSettingButton} />}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}
      style={styles.titleWrap}>
      {selectTab === SwapHomeTabType.SWAP && <SwapEnter />}
      {selectTab === SwapHomeTabType.LIMIT && <LimitEnter />}
    </PageContainer>
  );
};

export default memo(SwapHome);
