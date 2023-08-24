import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import Svg from 'components/Svg';
import { useGetCurrentCAContract } from 'hooks/contract';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { encodedDeletionManager } from 'utils/guardian';
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

const MockCheck = { validatedAssets: false, validatedGuardian: false, validatedDevice: true };

export default function AccountCancelation() {
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();

  const onDeletion = useCallback(async () => {
    if (!caHash || !managerAddress) return;
    const caContract = await getCurrentCAContract();

    const req = await encodedDeletionManager(caContract, managerAddress, caHash);

    // request.wallet.deletionAccount({
    //   params: {
    //     rawTransaction: req.data,
    //   },
    // });
    console.log(req, '=====req');
  }, [caHash, getCurrentCAContract, managerAddress]);

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
    // request.wallet.deletionCheck()
    // api check
    const { validatedAssets, validatedDevice, validatedGuardian } = MockCheck || {};
    const list = [];
    if (validatedAssets !== undefined && !validatedAssets) list.push(AlertMap.Asset);
    if (validatedDevice !== undefined && !validatedDevice) list.push(AlertMap.Guardian);
    if (validatedGuardian !== undefined && !validatedGuardian) list.push(AlertMap['Login Device']);
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
