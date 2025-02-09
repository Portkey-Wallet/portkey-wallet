// https://github.com/kuatsu/react-native-cloud-storage/blob/master/example/src/views/Home.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import aes from '@portkey-wallet/utils/aes';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import CommonButton from 'components/CommonButton';
import GStyles from 'mobile-did/js/assets/theme/GStyles';
import CommonInput from 'mobile-did/js/components/CommonInput';
import CheckBox from 'components/CheckBox';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-eoa/network';
import navigationService from 'utils/navigationService';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCredentials } from 'hooks/store';
import { useCloudStorage } from './useCloudStorage';
import CommonToast from 'components/CommonToast';
import { getPasswords, passwordShowFormat } from './index';

export default function CloudBackupCases() {
  const styles = getStyles();
  // const { theme } = useTheme();
  // const [copied, setCopied] = useState(false);
  //
  // // const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const credentials = useCredentials();
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordShow, setConfirmPasswordShow] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const onClickCheckBox = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  useEffect(() => {
    console.log('cloud backup - currentWallet: ', currentWallet, credentials);
  }, [credentials, currentWallet]);

  const {
    // cloudStorage,
    readFile,
    handleCreateDirectory,
    handleDeleteDirectory,
    handleListContents,
    handleCreateFile,
    loading,
  } = useCloudStorage();

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <View>
        <CommonButton disabled={loading} type="primary" onPress={handleCreateDirectory} style={{ marginTop: 10 }}>
          handleCreateDirectory
        </CommonButton>
        <CommonButton
          disabled={loading}
          type="primary"
          onPress={() => {
            if (!currentWallet) {
              CommonToast.fail('Can not found wallet');
              return;
            }
            readFile(currentWallet.key);
          }}
          style={{ marginTop: 10 }}>
          readFile
        </CommonButton>
        <CommonButton
          disabled={loading}
          type="primary"
          onPress={() => handleDeleteDirectory(true)}
          style={{ marginTop: 10 }}>
          handleDeleteDirectory
        </CommonButton>
        <CommonButton disabled={loading} type="primary" onPress={handleListContents} style={{ marginTop: 10 }}>
          handleListContents/Wallet List in Cloud
        </CommonButton>
        <CommonButton
          disabled={loading}
          type="primary"
          onPress={() => {
            if (!currentWallet) {
              CommonToast.fail('Can not found wallet');
              return;
            }
            handleCreateFile({
              filename: currentWallet.key,
              // TODO, encrypt before create
              input: JSON.stringify(currentWallet),
            });
          }}
          style={{ marginTop: 10 }}>
          handleCreateFile
        </CommonButton>

        <Text style={styles.title}>Create password</Text>
        <Text style={styles.desc}>
          This password will secure your seed phrase in the cloud. We cannot reset it if you lose it, so please keep it
          safe.
        </Text>
        <View style={styles.inputContainer}>
          <CommonInput
            labelStyle={styles.inputLabel}
            label="Set password"
            type="general"
            keyboardType="numeric"
            value={passwordShow}
            placeholder="Enter password"
            onChangeText={(value: string) => {
              const { newPassword, passwordShow: _passwordShow } = getPasswords(value, password, secureTextEntry);
              setPassword(newPassword);
              setPasswordShow(_passwordShow);
              if (confirmPassword !== newPassword) {
                setErrorMessage('Not match, please try again.');
              } else {
                setErrorMessage('');
              }
            }}
            rightIcon={
              <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                <Touchable
                  onPress={() => {
                    setPassword('');
                    setPasswordShow('');
                  }}>
                  <Svg icon="clear4" iconStyle={{ marginRight: pTd(12) }} size={pTd(16)} />
                </Touchable>
                <Touchable
                  onPress={() => {
                    const newSecureTextEntry = !secureTextEntry;
                    setSecureTextEntry(newSecureTextEntry);
                    setPasswordShow(passwordShowFormat(newSecureTextEntry, password));
                  }}>
                  <Svg
                    icon={secureTextEntry ? 'visibility_off' : 'visibility'}
                    iconStyle={{ marginRight: pTd(8) }}
                    size={pTd(16)}
                  />
                </Touchable>
              </View>
            }
          />
          <CommonInput
            labelStyle={styles.inputLabel}
            label="Confirm password"
            type="general"
            keyboardType="numeric"
            value={confirmPasswordShow}
            placeholder="Confrim password"
            errorMessage={errorMessage}
            onChangeText={(value: string) => {
              const { newPassword, passwordShow: _passwordShow } = getPasswords(
                value,
                confirmPassword,
                confirmSecureTextEntry,
              );
              setConfirmPassword(newPassword);
              setConfirmPasswordShow(_passwordShow);
              if (password !== newPassword) {
                setErrorMessage('Not match, please try again.');
              } else {
                setErrorMessage('');
              }
            }}
            rightIcon={
              <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                <Touchable
                  onPress={() => {
                    setConfirmPassword('');
                    setConfirmPasswordShow('');
                  }}>
                  <Svg icon="clear4" iconStyle={{ marginRight: pTd(12) }} size={pTd(16)} />
                </Touchable>
                <Touchable
                  onPress={() => {
                    const newSecureTextEntry = !confirmSecureTextEntry;
                    setConfirmSecureTextEntry(newSecureTextEntry);
                    setConfirmPasswordShow(passwordShowFormat(newSecureTextEntry, confirmPassword));
                  }}>
                  <Svg
                    icon={confirmSecureTextEntry ? 'visibility_off' : 'visibility'}
                    iconStyle={{ marginRight: pTd(8) }}
                    size={pTd(16)}
                  />
                </Touchable>
              </View>
            }
          />
        </View>
      </View>

      <View>
        <View style={styles.understandContainer}>
          <View>
            <CheckBox checked={isChecked} onChange={() => onClickCheckBox()} boxStyle={styles.checkBox} />
          </View>
          <Text style={styles.understandText}>
            I understand that if I lose my password, I will not be able to access my backup, which could result in the
            loss of all my assets. I agree to{' '}
            <Text
              style={styles.link}
              onPress={() => {
                navigationService.navigate('ViewOnWebView', {
                  title: 'Terms of Service',
                  url: `${OfficialWebsite}/terms-of-service`,
                });
              }}>
              terms
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => {
                navigationService.navigate('ViewOnWebView', {
                  title: 'Privacy Policy',
                  url: `${OfficialWebsite}/privacy-policy`,
                });
              }}>
              privacy policy
            </Text>{' '}
            for using aelf wallet.
          </Text>
        </View>
        <CommonButton
          disabled={!isChecked || !!errorMessage}
          type="primary"
          style={styles.continueButton}
          onPress={async () => {
            // TODO:
            // if directory exists, will not create again.
            await handleCreateDirectory();
            if (!currentWallet) {
              CommonToast.fail('Can not found wallet');
              return;
            }
            await handleCreateFile({
              filename: currentWallet.key,
              // TODO, encrypt before create
              input: aes.encrypt(JSON.stringify(currentWallet), password),
            });
          }}>
          Continue
        </CommonButton>
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
  },
  title: {
    marginTop: pTd(24),
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  desc: {
    color: theme.colors.textBase2,
    marginTop: pTd(16),
    fontSize: pTd(14),
  },
  inputContainer: {
    marginTop: pTd(24),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputLabel: {
    paddingLeft: 0,
  },
  understandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    backgroundColor: theme.colors.bgBase1,
    marginRight: pTd(12),
  },
  understandText: {
    flex: 1,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
  },
  link: {
    fontSize: pTd(14),
    color: theme.colors.textBrand3,
  },
  continueButton: {
    marginTop: pTd(24),
    marginBottom: pTd(16),
  },
}));
