import { request } from '@portkey-wallet/api/api-did';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import PageContainer from 'components/PageContainer';
import { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import Svg from 'components/Svg';
import { useAppleAuthentication } from 'hooks/authentication';
import { useGetCurrentCAContract } from 'hooks/contract';
import useEffectOnce from 'hooks/useEffectOnce';
import useLogOut from 'hooks/useLogOut';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { removeManager } from 'utils/guardian';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['blue', 'gray'];

const TipMap = {
  Asset: 'Your account has no balance, including tokens and NFTs.',
  Guardian: 'Your Apple ID is not set as a guardian by any other accounts.',
  'Login Device': 'Your account is only logged in on this device.',
};

const TipList = Object.entries(TipMap).map(([title, tip]) => ({ title, tip }));

const AlertMap = {
  Asset:
    'There are remaining assets in your account. To proceed, please first transfer all assets out of your account.',
  Guardian: `Your Apple ID is set as a guardian by other accounts. To proceed, please first remove your Apple ID's linked guardian.`,
  'Login Device':
    'Your account is logged in on other devices. To proceed, please first log out there or remove the login device.',
};

const ScrollViewProps = { disabled: true };

export default function AccountCancelation() {
  const { caHash, address: managerAddress, managerInfo } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const { appleSign } = useAppleAuthentication();
  const logout = useLogOut();

  const onDeletion = useCallback(async () => {
    if (!caHash || !managerAddress) return;
    let appleToken;
    Loading.show();
    try {
      const userInfo = await appleSign();
      if (userInfo?.user?.id !== managerInfo?.loginAccount) {
        Loading.hide();
        return CommonToast.fail('Account does not match');
      }
      appleToken = userInfo.identityToken;
    } catch (error) {
      // error
    }
    if (!appleToken) return Loading.hide();
    const caContract = await getCurrentCAContract();
    const req = await removeManager(caContract, managerAddress, caHash);
    if (req && !req.error) {
      try {
        await request.wallet.deletionAccount({ params: { appleToken } });
      } catch (error) {
        console.log(error);
      } finally {
        logout();
      }
    } else {
      CommonToast.failError(req?.error);
    }
    Loading.hide();
  }, [appleSign, caHash, getCurrentCAContract, logout, managerAddress, managerInfo?.loginAccount]);

  const AlertWaring = useCallback(
    (pass?: boolean) => {
      ActionSheet.alert({
        title: 'Warning',
        message: `Are you sure you want to delete your account? Please note that you won't be able to recover your account once it's deleted. `,
        buttons: [
          { title: 'Cancel', onPress: pass ? undefined : navigationService.goBack, type: 'outline' },
          { title: 'Continue', onPress: pass ? onDeletion : undefined },
        ],
      });
    },
    [onDeletion],
  );
  useEffectOnce(() => {
    // show alert after transition animation
    const timer = setTimeout(() => {
      AlertWaring();
    }, 500);
    return () => clearTimeout(timer);
  });
  const onConfirm = useCallback(async () => {
    if (!caHash || !managerAddress) return;
    Loading.show();
    try {
      // deletion check
      const req = await request.wallet.deletionCheck();
      const { validatedAssets, validatedDevice, validatedGuardian } = req || {};
      const list: string[] = [];
      if (!validatedAssets) list.push(AlertMap.Asset);
      if (!validatedDevice) list.push(AlertMap['Login Device']);
      if (!validatedGuardian) list.push(AlertMap.Guardian);
      if (list.length > 0) {
        const messageList = list.map((tip, index) => (
          <TextM key={index} style={styles.alertMessage}>
            {list.length > 1 ? `${index + 1}. ` : ''}
            {tip}
          </TextM>
        ));
        return ActionSheet.alert({
          title: 'Unable to Delete Account',
          messageList: messageList,
          buttons: [{ title: 'OK' }],
        });
      }
      AlertWaring(true);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [AlertWaring, caHash, managerAddress]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      containerStyles={styles.pageWrap}
      titleDom={'Account Deletion'}
      safeAreaColor={safeAreaColor}>
      <ScrollView>
        <View style={styles.containerStyle}>
          <Svg icon="warning" color={FontStyles.font13.color} size={pTd(42)} />
          <TextM style={styles.tipText}>
            Account deletion is an irreversible operation. Once deleted, your account cannot be recovered. Please
            carefully consider this before continuing.
          </TextM>
          <View style={styles.boxStyle}>
            <TextM style={FontStyles.font3}>
              Please note that your account can only be deleted if it meets the following conditions:
            </TextM>
            {TipList.map(({ title, tip }, index) => {
              return (
                <View style={styles.tipItem} key={index}>
                  <TextL style={styles.titleStyle}>
                    {index + 1}. {title}
                  </TextL>
                  <TextM style={FontStyles.font3}>{tip}</TextM>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <CommonButton title="Confirm" type="primary" onPress={onConfirm} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  containerStyle: {
    ...GStyles.itemCenter,
  },
  tipText: {
    marginVertical: 16,
  },
  boxStyle: {
    borderRadius: 6,
    width: '100%',
    ...GStyles.paddingArg(24, pTd(12)),
    ...BGStyles.bg1,
  },
  tipItem: {
    marginTop: 24,
  },
  titleStyle: {
    ...FontStyles.font5,
    marginBottom: 4,
    ...FontStyles.weight500,
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
  },
});
