import { View } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import navigationService from 'utils/navigationService';
import { TextH1 } from 'components/CommonText';
import { LottieView } from 'components/LottieView';
import { useAddWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import CommonToast from 'components/CommonToast';

type RouterParams = {
  pin: string;
  mnemonics?: string;
  privateKey?: string;
};

const ScrollViewProps = { disabled: true };
export default function PrepareWallet() {
  const styles = getStyles();
  const { pin, mnemonics, privateKey } = useRouterParams<RouterParams>();

  const addWallet = useAddWallet();
  const init = useCallback(() => {
    const result = addWallet(pin, mnemonics, privateKey);
    if (!result || !result.success) {
      CommonToast.fail(result?.message || 'Import failed');
    }
    console.log('pin: ', pin, mnemonics, privateKey, result);
    navigationService.reset('Tab');
  }, [addWallet, pin, mnemonics, privateKey]);
  const initRef = useRef(init);
  initRef.current = init;

  useEffect(() => {
    initRef.current();
  }, []);

  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      noLeftDom
      hideHeader
      notHandleHardwareBackPress
      hideTouchable>
      <TextH1>{'Creating your wallet...'}</TextH1>
      <View style={styles.loadingWrap}>
        <LottieView source={require('assets/lottieFiles/loading.json')} style={styles.loadingStyle} autoPlay loop />
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(_theme => ({
  containerStyle: {
    justifyContent: 'space-between',
    paddingTop: pTd(58),
    paddingBottom: pTd(32),
  },
  loadingWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: pTd(83),
  },
  loadingStyle: {
    width: pTd(32),
  },
}));
