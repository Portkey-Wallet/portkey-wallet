// https://github.com/kuatsu/react-native-cloud-storage/blob/master/example/src/views/Home.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import CheckBox from 'components/CheckBox';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-eoa/network';
import navigationService from 'utils/navigationService';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
// import { useCredentials } from 'hooks/store';
import { useCloudStorage } from './useCloudStorage';
import CommonToast from 'components/CommonToast';
import { useCredentials } from 'hooks/store';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { validatePassword } from 'utils/password';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { updateWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

function generateDots(length: number) {
  if (length < 0) {
    throw new Error('Length must be a non-negative number');
  }
  return '•'.repeat(length);
}

export function passwordShowFormat(isSecure: boolean, password: string) {
  return isSecure ? generateDots(password.length) : password;
}

export function getPasswords(newValue: string, prePassword: string, isSecure: boolean) {
  const _password = newValue.trim();
  const _passwordLength = _password.length;
  const prePasswordLength = prePassword.length;
  // let newPassword = _password ? prePassword.slice(0, _passwordLength - 1) + _password[_passwordLength - 1] : '';
  let newPassword = prePassword.slice(0, prePasswordLength - 1);
  if (!_password) {
    newPassword = '';
  } else if (prePasswordLength < _passwordLength) {
    newPassword = prePassword.slice(0, _passwordLength - 1) + _password[_passwordLength - 1];
  }
  return {
    newPassword,
    passwordShow: passwordShowFormat(isSecure, newPassword),
  };
}

export default function CloudBackup() {
  const styles = getStyles();

  const {
    walletToBeBackup,
    // navigateTo = 'Home',
    navigateTo = 'Tab',
    navigatePop = 0,
    title = 'Create password',
    successToast = 'Backup completed',
  } = useRouterParams<{
    walletToBeBackup: TWalletInfo;
    navigateTo: string;
    navigatePop?: number;
    title?: string;
    successToast?: string;
  }>();

  const currentWalletLocal = useCurrentWallet();
  const currentWallet = useMemo(() => {
    if (walletToBeBackup) {
      return walletToBeBackup;
    }
    return currentWalletLocal;
  }, [currentWalletLocal, walletToBeBackup]);

  const dispatch = useAppCommonDispatch();
  const credentials = useCredentials();
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordShow, setConfirmPasswordShow] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [enterPasswordErrorMessage, setEnterPasswordErrorMessage] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const onClickCheckBox = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  const { handleCreateDirectory, handleCreateFile, loading, googleSignAndConfig, cloudAvailable } = useCloudStorage();

  useEffect(() => {
    if (!isIOS) {
      googleSignAndConfig(false);
    }
  }, [googleSignAndConfig]);

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>
          This password will secure your seed phrase in the cloud. We cannot reset it if you lose it, so please keep it
          safe.
        </Text>
        <View style={styles.inputContainer}>
          <CommonInput
            labelStyle={styles.inputLabel}
            errorStyle={{
              marginBottom: enterPasswordErrorMessage ? pTd(20) : pTd(0),
            }}
            label="Set password"
            type="general"
            keyboardType="numeric"
            value={passwordShow}
            placeholder="Enter password"
            errorMessage={enterPasswordErrorMessage}
            onChangeText={(value: string) => {
              const { newPassword, passwordShow: _passwordShow } = getPasswords(value, password, secureTextEntry);
              setPassword(newPassword);
              setPasswordShow(_passwordShow);
              if (confirmPassword !== newPassword && confirmPassword.length) {
                setErrorMessage('Not match, please try again.');
              } else {
                setErrorMessage('');
              }
              if (!validatePassword(newPassword)) {
                setEnterPasswordErrorMessage('Must be at least 8 characters long, including at least 1 number.');
              } else {
                setEnterPasswordErrorMessage('');
              }
            }}
            rightIcon={
              <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                {passwordShow && (
                  <Touchable
                    onPress={() => {
                      setPassword('');
                      setPasswordShow('');
                    }}>
                    <Svg icon="clear4" iconStyle={{ marginRight: pTd(12) }} size={pTd(16)} />
                  </Touchable>
                )}
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
              if (password === newPassword) {
                setErrorMessage('');
              }
            }}
            onBlur={() => {
              if (password !== confirmPassword && confirmPassword.length) {
                setErrorMessage('Not match, please try again.');
              } else {
                setErrorMessage('');
              }
            }}
            rightIcon={
              <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                {confirmPasswordShow && (
                  <Touchable
                    onPress={() => {
                      setConfirmPassword('');
                      setConfirmPasswordShow('');
                      setErrorMessage('');
                    }}>
                    <Svg icon="clear4" iconStyle={{ marginRight: pTd(12) }} size={pTd(16)} />
                  </Touchable>
                )}
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
          disabled={
            !isChecked ||
            !!errorMessage ||
            !!enterPasswordErrorMessage ||
            !password ||
            !confirmPassword ||
            !cloudAvailable
          }
          loading={loading}
          type="primary"
          style={styles.continueButton}
          onPress={async () => {
            console.log('currentWallet: ', currentWallet);
            if (!currentWallet) {
              CommonToast.fail('Can not found wallet');
              return;
            }
            const _currentWallet: TWalletInfo = JSON.parse(JSON.stringify(currentWallet));
            _currentWallet.name = '';
            if (!credentials?.pin) {
              // almost impossible
              CommonToast.fail('Wallet is locked');
              return;
            }
            const { pin } = credentials;
            if (_currentWallet.AESEncryptMnemonic) {
              const result = aes.decrypt(_currentWallet.AESEncryptMnemonic, pin);
              if (!result) {
                CommonToast.fail('Decrypt failed');
              }
              _currentWallet.AESEncryptMnemonic = aes.encrypt(result as string, password);
            }
            _currentWallet.accountList.map(account => {
              const result = aes.decrypt(account.AESEncryptPrivateKey, pin);
              if (!result) {
                CommonToast.fail('Decrypt failed');
              }
              account.AESEncryptPrivateKey = aes.encrypt(result as string, password);
              account.name = '';
              account.icon = '';
            });
            _currentWallet.isBackup = true;
            console.log('_currentWallet: ', _currentWallet, currentWallet);
            // if directory exists, will not create again.
            await handleCreateDirectory();

            await handleCreateFile({
              filename: _currentWallet.key,
              input: JSON.stringify({
                updateTime: Date.now(),
                wallet: aes.encrypt(JSON.stringify(_currentWallet), password),
              }),
            });
            dispatch(
              updateWallet({
                wallet: {
                  ...currentWallet,
                  isBackup: true,
                },
              }),
            );
            if (navigateTo === 'Tab') {
              navigationService.navigate('Tab');
            } else if (navigatePop >= 0) {
              navigationService.pop(navigatePop);
            }
            CommonToast.success(successToast);
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
    color: theme.colors.textBrand1,
  },
  continueButton: {
    marginTop: pTd(24),
    marginBottom: pTd(16),
  },
}));
