import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
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
import { useGetCurrentCAContract } from 'hooks/contract';
import useEffectOnce from 'hooks/useEffectOnce';
import useLogOut from 'hooks/useLogOut';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { useGetCurrentLoginAccountVerifyFunc } from 'hooks/verification';
import { useGuardiansInfo } from 'hooks/store';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import {
  getSocialLoginAccountToken,
  deleteLoginAccount,
  checkIsValidateDeletionAccount,
} from '@portkey-wallet/utils/deleteAccount';
import {
  ACCOUNT_CANCELATION_CONDITIONS,
  ACCOUNT_CANCELATION_NOTE,
  ACCOUNT_CANCELATION_TIP,
  ACCOUNT_CANCELATION_WARNING,
} from '@portkey-wallet/constants/constants-ca/wallet';
import { CONTACT_PRIVACY_TYPE_LABEL_MAP } from '@portkey-wallet/constants/constants-ca/contact';

const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['blue', 'gray'];

const ScrollViewProps = { disabled: true };

export default function AccountCancelation() {
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const currentLoginAccountVerifyFunc = useGetCurrentLoginAccountVerifyFunc();
  const logout = useLogOut();
  const { userGuardiansList } = useGuardiansInfo();
  const guardianItem = useMemo(() => userGuardiansList?.[0], [userGuardiansList]);
  const { guardianType, verifier, guardianAccount } = guardianItem || {};

  const originChainId = useOriginChainId();

  const onDeletion = useCallback(async () => {
    if (!caHash || !managerAddress) return;
    if (guardianType === undefined) return;
    Loading.show();

    let socialLoginToken = '';
    if (guardianType === LoginType.Email) {
      Loading.hide();
      return currentLoginAccountVerifyFunc?.();
    } else {
      try {
        const token = await getSocialLoginAccountToken({
          currentLoginAccount: guardianAccount || '',
          getAccountUserInfoFunc: currentLoginAccountVerifyFunc,
        });
        socialLoginToken = token;
      } catch (error) {
        CommonToast.failError(error);
      }
    }

    if (!socialLoginToken) return Loading.hide();
    const caContract = await getCurrentCAContract();
    const removeManagerParams = {
      caContract,
      managerAddress,
      caHash,
    };
    const deleteParams = {
      type: LoginType[guardianType],
      chainId: originChainId,
      token: socialLoginToken,
      verifierId: verifier?.id || '',
      guardianIdentifier: guardianAccount,
    };

    try {
      await deleteLoginAccount({
        removeManagerParams,
        deleteParams,
      });
      await logout();
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [
    caHash,
    currentLoginAccountVerifyFunc,
    getCurrentCAContract,
    guardianAccount,
    guardianType,
    logout,
    managerAddress,
    originChainId,
    verifier?.id,
  ]);

  const AlertWaring = useCallback(
    (pass?: boolean) => {
      ActionSheet.alert({
        title: 'Warning',
        message: ACCOUNT_CANCELATION_WARNING,
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
      const list = await checkIsValidateDeletionAccount(LoginType[guardianType || 0]);

      if (list.length > 0) {
        return ActionSheet.alert({
          title: 'Unable to Delete Account',
          messageList: list.map(ele =>
            ele.replace(/LOGIN_ACCOUNT/g, CONTACT_PRIVACY_TYPE_LABEL_MAP[guardianType || 0]),
          ),
          buttons: [{ title: 'OK' }],
        });
      }
      AlertWaring(true);
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [AlertWaring, caHash, guardianType, managerAddress]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      containerStyles={styles.pageWrap}
      titleDom={'Account Deletion'}
      safeAreaColor={safeAreaColor}>
      <ScrollView>
        <View style={styles.containerStyle}>
          <Svg icon="warning" color={FontStyles.font13.color} size={pTd(42)} />
          <TextM style={styles.tipText}>{ACCOUNT_CANCELATION_TIP}</TextM>
          <View style={styles.boxStyle}>
            <TextM style={FontStyles.font3}>{ACCOUNT_CANCELATION_NOTE}</TextM>
            {ACCOUNT_CANCELATION_CONDITIONS.map(({ title, content }, index) => {
              return (
                <View style={styles.tipItem} key={index}>
                  <TextL style={styles.titleStyle}>
                    {index + 1}. {title}
                  </TextL>
                  <TextM style={FontStyles.font3}>
                    {content.replace(/LOGIN_ACCOUNT/g, CONTACT_PRIVACY_TYPE_LABEL_MAP[guardianType || 0])}
                  </TextM>
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
