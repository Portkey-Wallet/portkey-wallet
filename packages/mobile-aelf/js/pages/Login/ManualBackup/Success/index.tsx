import React from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import CommonAvatar from 'components/CommonAvatar';
import backUpWalletSuccessLogo from 'assets/image/pngs/backupWalletSuccess.png';

export default function ManualBackupSuccess() {
  const styles = getStyles();

  return (
    <PageContainer
      titleDom
      noLeftDom
      hideHeader
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.page}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <CommonAvatar
            style={styles.logo}
            hasBorder={false}
            localImage={backUpWalletSuccessLogo}
            avatarSize={pTd(240)}
          />
        </View>
        <Text style={styles.title}>Manual backup completed</Text>
        <Text style={styles.desc}>You have successfully backed up your wallet.</Text>
      </View>
      <CommonButton
        type="primary"
        style={styles.continueButton}
        onPress={() => {
          navigationService.push('Tab');
        }}>
        View wallet
      </CommonButton>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.colors.bgBase1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    marginTop: pTd(104),
    height: pTd(240),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: pTd(16),
  },
  logo: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: pTd(32),
    lineHeight: pTd(32) * 1.2,
    ...fonts.BGMediumFont,
    textAlign: 'center',
  },
  desc: {
    color: theme.colors.textBase1,
    marginTop: pTd(16),
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: pTd(24),
    marginBottom: pTd(16),
  },
}));
