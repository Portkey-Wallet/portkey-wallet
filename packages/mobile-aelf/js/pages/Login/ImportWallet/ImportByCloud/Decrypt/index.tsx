// https://github.com/kuatsu/react-native-cloud-storage/blob/master/example/src/views/Home.tsx
import React, { useState } from 'react';
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
import CommonToast from 'components/CommonToast';
import { getPasswords, passwordShowFormat } from '../../../CloudBackup';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useImportWallet } from '../../../hooks/useImportWallet';

export default function DecryptByPassword() {
  const styles = getStyles();

  const { walletInCloud, checkedSecurityLock } = useRouterParams<{
    walletInCloud: string;
    checkedSecurityLock?: boolean;
  }>();

  console.log('walletInCloud: ', walletInCloud);
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { importWalletByPrivateKey, importWalletByMnemonic } = useImportWallet();

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <View>
        <Text style={styles.title}>Password</Text>
        <Text style={styles.desc}>Enter the password that protects your seed phrase in the cloud.</Text>
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
        </View>
      </View>

      <View>
        <CommonButton
          disabled={!password}
          type="primary"
          style={styles.continueButton}
          onPress={async () => {
            const result = aes.decrypt(walletInCloud, password);
            if (!result) {
              CommonToast.fail('Password error');
              return;
            }
            console.log('decrypt result: ', result, JSON.parse(result));
            const wallet: TWalletInfo = JSON.parse(result);
            if (wallet.AESEncryptMnemonic) {
              const mnemonic = aes.decrypt(wallet.AESEncryptMnemonic, password);
              if (!mnemonic) {
                CommonToast.fail('Password error');
                return;
              }
              console.log('mnemonic: ', mnemonic);
              importWalletByMnemonic(mnemonic, checkedSecurityLock);
            } else {
              const privateKey = aes.decrypt(wallet.accountList[0].AESEncryptPrivateKey, password);
              if (!privateKey) {
                CommonToast.fail('Password error');
                return;
              }
              console.log('privateKey: ', privateKey);
              importWalletByPrivateKey(privateKey, checkedSecurityLock);
            }
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
  continueButton: {
    marginTop: pTd(24),
    marginBottom: pTd(16),
  },
}));
