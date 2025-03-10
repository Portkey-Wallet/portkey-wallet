import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import aes from '@portkey-wallet/utils/aes';
import * as Clipboard from 'expo-clipboard';
import { makeStyles, useTheme } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { useCredentials } from 'hooks/store';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { getStyles } from '../../../Login/ManualBackup';
import { BlurView } from '@react-native-community/blur';
import { updateWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCloudStorage } from '../../../Login/CloudBackup/useCloudStorage';
import ActionSheet from 'components/ActionSheet';
import { defaultColors } from 'assets/theme';

export default function AddressBackup() {
  const styles = getStyles();
  const pageStyles = getBackupStyles();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppCommonDispatch();
  const { cloudAvailable, handleListContents, handleDeleteFile, googleSignAndConfig, loading } = useCloudStorage();
  // const [walletsKeyInCloud, setWalletsKeyInCloud] = useState<string[]>([]);
  const [walletBackedUp, setWalletBackedUp] = useState<boolean>(false);

  const { walletToBeBackup, accountToBeBackup, backupType } = useRouterParams<{
    walletToBeBackup: TWalletInfo;
    accountToBeBackup: TAccountInfo;
    backupType: 'Private key' | 'Seed phrase';
  }>();
  const credentials = useCredentials();

  const { mnemonics, privateKey } = useMemo(() => {
    if (!walletToBeBackup || !credentials?.pin) {
      return {
        mnemonics: [],
        privateKey: '',
      };
    }
    const mnemonicString = aes.decrypt(walletToBeBackup.AESEncryptMnemonic, credentials.pin);
    const privateKeyString = aes.decrypt(accountToBeBackup.AESEncryptPrivateKey, credentials.pin);
    if ((!mnemonicString && backupType === 'Seed phrase') || (!privateKeyString && backupType === 'Private key')) {
      CommonToast.failError('Decrypt failed');
      return {
        mnemonics: [],
        privateKey: '',
      };
    }
    console.log('decrypt: ', mnemonicString, walletToBeBackup.AESEncryptMnemonic, credentials.pin, privateKeyString);
    return {
      mnemonics: mnemonicString ? mnemonicString.split(' ') : [],
      privateKey: privateKeyString || '',
    };
  }, [accountToBeBackup.AESEncryptPrivateKey, backupType, credentials?.pin, walletToBeBackup]);

  const inputWidth = useMemo(() => {
    return (screenWidth - pTd(16) * 3) / 2;
  }, []);

  const getWalletsInCloud = useCallback(async () => {
    const wallets = await handleListContents();
    if (!wallets) {
      return;
    }
    console.log('wallets in cloud', wallets);
    // setWalletsKeyInCloud(wallets);
    setWalletBackedUp(wallets.includes(walletToBeBackup.key));
  }, [handleListContents, walletToBeBackup.key]);
  useEffect(() => {
    if (!cloudAvailable) {
      return;
    }
    getWalletsInCloud();
    const timer = setInterval(() => {
      getWalletsInCloud();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [cloudAvailable, getWalletsInCloud]);

  const onCopy = useCallback(async () => {
    const isCopy = await Clipboard.setStringAsync(backupType === 'Private key' ? privateKey : mnemonics.join(' '));
    if (isCopy) {
      setCopied(true);
      if (backupType === 'Seed phrase') {
        dispatch(
          updateWallet({
            wallet: {
              ...walletToBeBackup,
              isBackup: true,
            },
          }),
        );
      }
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [backupType, dispatch, mnemonics, privateKey, walletToBeBackup]);

  const copyButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onCopy}>
        <Svg icon="copy" size={pTd(20)} />
        <Text style={styles.buttonText}>Copy to clipboard</Text>
      </Touchable>
    );
  }, [onCopy, styles]);

  const copiedView = useMemo(() => {
    return (
      <View style={styles.button}>
        <Svg icon="check-circle" size={pTd(20)} color={theme.colors.iconSuccess2} />
        <Text style={styles.copyText}>{backupType} copied</Text>
      </View>
    );
  }, [backupType, styles.button, styles.copyText, theme.colors.iconSuccess2]);

  const cloudType = isIOS ? 'iCloud' : 'Google Drive';

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={[styles.containerStyles, pageStyles.pageContainer]}
      scrollViewProps={{ disabled: true }}>
      <View>
        <Text style={styles.title}>{backupType}</Text>
        <View style={pageStyles.tipWrap}>
          <Svg icon="warning" size={pTd(22)} color={theme.colors.iconDanger3} />
          <View style={pageStyles.tipTextContainer}>
            <Text style={pageStyles.tipTitle}>DO NOT share your seed phrase with anyone!</Text>
            <Text style={pageStyles.tipSubTitle}>
              Anyone who has access to your seed phrase can access your wallet and assets.
            </Text>
          </View>
        </View>
        <View style={styles.mnemonicsWrap}>
          {backupType === 'Seed phrase' &&
            mnemonics.map((mnemonic, index) => (
              <View
                key={index}
                style={[
                  styles.wordWrap,
                  { width: inputWidth },
                  index % 2 === 1 && styles.wordMarginLeft,
                  index > 1 && styles.wordMarginTop,
                ]}>
                <Text style={styles.wordLabel}>{index + 1}</Text>
                <Text style={styles.mnemonicsLabel}>{mnemonic}</Text>
              </View>
            ))}
          {backupType === 'Private key' && (
            <View style={pageStyles.privateKeyWrap}>
              <Text style={pageStyles.privateKey}>{privateKey}</Text>
            </View>
          )}
          {!visible && (
            <>
              <BlurView style={pageStyles.overlay} blurAmount={10} blurType="dark" />
              <View style={pageStyles.eyeButton}>
                <Touchable onPress={() => setVisible(true)} style={pageStyles.eyeButtonTouchArea}>
                  <Svg icon="visibility" size={pTd(20)} color={theme.colors.textBase1Opacity07} />
                </Touchable>
              </View>
            </>
          )}
        </View>
        {copied ? copiedView : copyButton}
      </View>
      {!isIOS && !cloudAvailable && (
        <CommonButton
          type="primary"
          style={[styles.continueButton, pageStyles.continueButton]}
          loading={loading}
          onPress={async () => {
            const result = await googleSignAndConfig();
            console.log('googleSignAndConfig result', result, cloudAvailable);
            if (!result || !result.success) {
              CommonToast.fail('Please login');
              return;
            }
          }}>
          Login Google to Backup
        </CommonButton>
      )}
      {backupType === 'Seed phrase' && !(!isIOS && !cloudAvailable) && (
        <>
          {!walletBackedUp ? (
            <CommonButton
              disabled={!cloudAvailable}
              type="primary"
              // type="outline"
              style={[styles.continueButton, pageStyles.continueButton]}
              onPress={async () => {
                navigationService.push('CloudBackup', {
                  walletToBeBackup,
                  navigateTo: 'AddressBackup',
                  navigatePop: 1,
                });
              }}>
              Backup on {cloudType}
            </CommonButton>
          ) : (
            <>
              <CommonButton
                disabled={!cloudAvailable}
                type="outline"
                style={styles.continueButton}
                onPress={() => {
                  navigationService.push('CloudBackup', {
                    walletToBeBackup,
                    navigateTo: 'AddressBackup',
                    navigatePop: 1,
                    title: 'Reset password',
                    successToast: 'Password changed',
                  });
                }}>
                Change backup password
              </CommonButton>
              <CommonButton
                disabled={!cloudAvailable}
                type="warningNoBorder"
                style={[
                  styles.continueButton,
                  {
                    marginTop: pTd(16),
                  },
                ]}
                onPress={() => {
                  ActionSheet.alert({
                    isCloseShow: true,
                    title: <Svg size={pTd(32)} icon="error" color={defaultColors.iconBase1} />,
                    title2: 'Remove backup?',
                    message:
                      'Are you sure you want to remove your seed phrase backup? You can back it up again at any time.',
                    buttonGroupDirection: 'column',
                    buttons: [
                      {
                        title: 'Remove',
                        type: 'warning',
                        onPress: async () => {
                          try {
                            await handleDeleteFile(walletToBeBackup.key);
                            await getWalletsInCloud();
                            CommonToast.success(`${cloudType} backup removed`);
                          } catch (e) {
                            console.warn('Remove backup failed', e);
                            CommonToast.fail(`Remove ${cloudType} backup failed`);
                          }
                        },
                      },
                      {
                        title: 'Cancel',
                        type: 'outline',
                      },
                    ],
                  });
                }}>
                Remove {cloudType} backup
              </CommonButton>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}

const getBackupStyles = makeStyles(theme => ({
  pageContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tipWrap: {
    backgroundColor: theme.colors.bgDanger3,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderDanger3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
    marginTop: pTd(16),
  },
  tipTextContainer: {
    flex: 1,
    marginLeft: pTd(12),
  },
  tipTitle: {
    ...fonts.SGMediumFont,
    color: theme.colors.textDanger6,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
  },
  tipSubTitle: {
    color: theme.colors.textDanger6,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
  },
  mnemonicsWrap: {
    position: 'relative',
  },
  privateKeyWrap: {
    borderRadius: pTd(8),
    borderColor: theme.colors.borderBase1,
    borderWidth: pTd(1),
    height: pTd(128 + 32),
    padding: pTd(16),
  },
  privateKey: {
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
  },
  overlay: {
    position: 'absolute',
    top: -pTd(8),
    left: -pTd(0),
    right: -pTd(0),
    bottom: -pTd(8),
    borderRadius: pTd(8),
  },
  eyeButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  eyeButtonTouchArea: {
    width: pTd(40),
    height: pTd(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    marginBottom: pTd(16),
  },
}));
