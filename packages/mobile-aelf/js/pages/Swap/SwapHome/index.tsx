import React, { memo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import SwapEnter from '../components/SwapEnter/index';
import LimitEnter from '../components/LimitEnter/index';
import SwapSettingButton from '../components/SwapSettingButton/index';
import { getStyles } from './style';
import { useAwakenTokenList } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';

enum SwapHomeTabType {
  SWAP = 'Swap',
  LIMIT = 'Limit',
}

const SwapHome = () => {
  const styles = getStyles();
  useAwakenTokenList(true);

  const [selectTab, _] = useState<SwapHomeTabType>(SwapHomeTabType.SWAP);

  return (
    <PageContainer
      // titleDom={<CommonTopTabWithoutContent tabList={tabList} selectTab={selectTab} onTabPress={setSelectTab} />}
      titleDom={'Swap'}
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
