import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import ImportWalletTabSwitch from './ImportWalletTabSwitch';
import RecoveryPhrase from './RecoveryPhrase';
import PrivateKey from './PrivateKey';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';

type RouterParams = {
  importType: string;
  checkedSecurityLock?: boolean;
};

export default function ImportWallet() {
  const styles = getStyles();
  const { importType, checkedSecurityLock } = useRouterParams<RouterParams>();

  const [isPrivateKeySelected, setPrivateKeySelected] = useState(false);

  useEffect(() => {
    if (importType === 'privateKey') {
      setPrivateKeySelected(true);
    }
  }, [importType]);

  const onSelectedTab = useCallback(
    (privateKeySelected: boolean) => {
      setPrivateKeySelected(privateKeySelected);
    },
    [setPrivateKeySelected],
  );

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <Text style={styles.title}>
        {/*{isPrivateKeySelected ? 'Import your Private key' : 'Import your Recovery phrase'}*/}
        Import your wallet
      </Text>
      <ImportWalletTabSwitch onSelected={onSelectedTab} />
      {isPrivateKeySelected ? (
        <PrivateKey checkedSecurityLock={checkedSecurityLock} />
      ) : (
        <RecoveryPhrase checkedSecurityLock={checkedSecurityLock} />
      )}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
  },
  title: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
}));
