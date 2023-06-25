import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import { TextL, TextM, TextS, TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import ListItem from 'components/ListItem';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { useVerifierList } from '@portkey-wallet/hooks/hooks-ca/network';
import VerifierOverlay from '../components/VerifierOverlay';
import { VerifierImage } from '../components/VerifierImage';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import myEvents from 'utils/deviceEvent';
import { verification } from 'utils/api';
import { AuthenticationInfo, RecaptchaType, VerificationType, VerifierItem } from '@portkey-wallet/types/verifier';
import { useVerifyToken } from 'hooks/authentication';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useOnRequestOrSetPin } from 'hooks/login';
import { usePin } from 'hooks/store';

export type RouterParams = {
  loginAccount: string;
  loginType: LoginType;
  authenticationInfo?: AuthenticationInfo;
  showLoginAccount?: string;
};

const ScrollViewProps = { disabled: true };
export default function SelectVerifier() {
  const { t } = useLanguage();
  const verifierList = useVerifierList();

  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem | undefined>(verifierList[0]);

  const { loginAccount, loginType, authenticationInfo, showLoginAccount } = useRouterParams<RouterParams>();
  const verifyToken = useVerifyToken();
  const originChainId = useOriginChainId();
  const onRequestOrSetPin = useOnRequestOrSetPin();
  const pin = usePin();
  const { address } = useCurrentWalletInfo();
  const onConfirmAuth = useCallback(async () => {
    const isRequestResult = !!(pin && address);
    Loading.show(isRequestResult ? { text: 'Creating address on the chain...' } : undefined);
    try {
      const rst = await verifyToken(loginType, {
        accessToken: authenticationInfo?.[loginAccount || ''],
        id: loginAccount,
        verifierId: selectedVerifier?.id,
        chainId: originChainId,
      });
      onRequestOrSetPin({
        showLoading: !isRequestResult,
        managerInfo: {
          verificationType: VerificationType.register,
          loginAccount: loginAccount,
          type: loginType,
        },
        verifierInfo: { ...rst, verifierId: selectedVerifier?.id },
      });
    } catch (error) {
      Loading.hide();
      CommonToast.failError(error);
    }
    !isRequestResult && Loading.hide();
  }, [
    address,
    authenticationInfo,
    loginAccount,
    loginType,
    onRequestOrSetPin,
    originChainId,
    pin,
    selectedVerifier?.id,
    verifyToken,
  ]);
  const onDefaultConfirm = useCallback(() => {
    const confirm = async () => {
      try {
        Loading.show();
        const requestCodeResult = await verification.sendVerificationCode({
          params: {
            type: LoginType[loginType],
            guardianIdentifier: loginAccount,
            verifierId: selectedVerifier?.id,
            chainId: originChainId,
            operationType: RecaptchaType.register,
          },
        });
        if (requestCodeResult.verifierSessionId) {
          navigationService.navigate('VerifierDetails', {
            requestCodeResult,
            verificationType: VerificationType.register,
            guardianItem: {
              isLoginAccount: true,
              verifier: selectedVerifier,
              guardianAccount: loginAccount,
              guardianType: loginType,
            },
          });
        } else {
          throw new Error('send fail');
        }
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    };

    ActionSheet.alert({
      title2: (
        <Text>
          <TextL>{`${selectedVerifier?.name} will send a verification code to `}</TextL>
          <TextL style={fonts.mediumFont}>{showLoginAccount || loginAccount}</TextL>
          <TextL>{` to verify your ${loginType === LoginType.Phone ? 'phone number' : 'email address'}.`}</TextL>
        </Text>
      ),
      buttons: [
        {
          title: t('Cancel'),
          // type: 'solid',
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: confirm,
        },
      ],
    });
  }, [loginAccount, loginType, originChainId, selectedVerifier, showLoginAccount, t]);
  const onConfirm = useCallback(async () => {
    switch (loginType) {
      case LoginType.Apple:
      case LoginType.Google:
        onConfirmAuth();
        break;
      default: {
        onDefaultConfirm();
        break;
      }
    }
  }, [loginType, onConfirmAuth, onDefaultConfirm]);
  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      scrollViewProps={ScrollViewProps}
      type="leftBack"
      titleDom
      leftCallback={() => {
        myEvents.clearSignupInput.emit();
        navigationService.goBack();
      }}>
      <View>
        <TextXXXL style={GStyles.textAlignCenter}>Select verifier</TextXXXL>
        <TextM style={[GStyles.textAlignCenter, FontStyles.font3, GStyles.marginTop(8)]}>
          {t(
            'Verifiers protect your account and help you recover your assets when they are subject to risks. Please note: The more diversified your verifiers are, the higher security your assets enjoy.',
          )}
        </TextM>
        <ListItem
          onPress={() =>
            selectedVerifier &&
            VerifierOverlay.showVerifierList({
              verifierList,
              selectedVerifier,
              callBack: setSelectedVerifier,
            })
          }
          titleLeftElement={
            <VerifierImage label={selectedVerifier?.name || ''} uri={selectedVerifier?.imageUrl} size={30} />
          }
          titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
          titleTextStyle={styles.titleTextStyle}
          style={[styles.selectedItem, BorderStyles.border1]}
          title={selectedVerifier?.name || ''}
          rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
        />
        <TextM style={fonts.mediumFont}>Popular</TextM>
        <View style={styles.verifierRow}>
          {verifierList.slice(0, 3).map(item => {
            return (
              <Touchable
                style={[GStyles.center, GStyles.flex1]}
                key={item.name}
                onPress={() => setSelectedVerifier(item)}>
                <VerifierImage label={item.name} uri={item.imageUrl} size={42} />
                <TextS style={[FontStyles.font3, styles.verifierTitle]}>{item.name}</TextS>
              </Touchable>
            );
          })}
        </View>
      </View>
      <CommonButton onPress={onConfirm} type="primary">
        {t('Confirm')}
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  selectedItem: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 13,
    marginTop: 24,
    marginBottom: 48,
  },
  titleTextStyle: {
    marginLeft: pTd(8),
    fontSize: pTd(14),
  },
  verifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  verifierTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});
