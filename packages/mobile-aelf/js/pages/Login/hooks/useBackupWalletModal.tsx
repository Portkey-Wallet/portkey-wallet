import { useCallback } from 'react';
import ActionSheet from 'components/ActionSheet';
import { Text, View } from 'react-native';
import CommonAvatar from 'components/CommonAvatar';
import backUpWalletLogo from 'assets/image/pngs/backupWalletLogo.png';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

export const useBackupWalletModal = () => {
  const checkSecurityLock = useCheckSecurityLock();
  const styles = getStyles();
  const showBackupWalletModal = useCallback(() => {
    ActionSheet.alert({
      isCloseShow: false,
      title: (
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <CommonAvatar style={styles.logo} hasBorder={false} localImage={backUpWalletLogo} avatarSize={pTd(240)} />
          </View>
          <Text style={styles.title}>Backup your wallet</Text>
          <Text style={styles.subTitle}>Back up your wallet to keep your seed phrase safe and secure your assets.</Text>
        </View>
      ),
      buttonGroupDirection: 'column',
      buttons: [
        {
          type: 'primary',
          title: isIOS ? 'Back up on iCloud' : 'Back up on Google Drive',
          onPress: async () => {
            navigationService.push('CloudBackup');
          },
        },
        {
          type: 'outline',
          title: 'Back up manually',
          onPress: async () => {
            try {
              await checkSecurityLock(() => {
                navigationService.push('ManualBackup');
                console.log('check success');
              });
            } catch (error) {
              console.log('checkPin error', error);
            }
          },
        },
        {
          type: 'transparent',
          title: "I'll do it later",
          onPress: async () => {
            // Do nothing will close this modal.
            console.log('I will do it later');
          },
        },
      ],
    });
  }, [checkSecurityLock, styles.container, styles.logo, styles.logoContainer, styles.subTitle, styles.title]);
  return {
    showBackupWalletModal,
  };
};

const getStyles = makeStyles(() => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    height: pTd(240),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: pTd(24),
  },
  logo: {
    backgroundColor: 'transparent',
  },
  title: {
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(32) * 1.2,
    textAlign: 'center',
    width: '100%',
  },
  subTitle: {
    fontSize: pTd(14),
    width: '100%',
    lineHeight: pTd(14) * 1.4,
    textAlign: 'center',
    marginTop: pTd(16),
    marginBottom: pTd(48),
  },
}));
