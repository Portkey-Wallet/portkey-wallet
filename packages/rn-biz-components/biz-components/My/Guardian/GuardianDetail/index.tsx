import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { TextL, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import { pageStyles } from './style';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import CommonSwitch from '@portkey-wallet/rn-components/components/CommonSwitch';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { useGuardiansInfo } from '@portkey-wallet/rn-base/hooks/store';
import { useGetGuardiansInfo } from '@portkey-wallet/rn-base/hooks/guardian';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { VerifierImage } from '../../../Guardian/components/VerifierImage';
// import { RouteProp, useRoute } from '@react-navigation/native';
import { useRoute } from '@portkey-wallet/rn-inject-sdk';
import GuardianAccountItem from '../components/GuardianAccountItem';
import Divider from '@portkey-wallet/rn-components/components/Divider';
import { checkIsLastLoginAccount } from '@portkey-wallet/utils/guardian';
import { useSetLoginAccount } from '../hooks/useSetLoginAccount';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';

type RouterParams = {
  guardian?: UserGuardianItem;
};

export default function GuardianDetail() {
  const { guardian: guardianRouter } = useRoute();
  const getGuardiansInfo = useGetGuardiansInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const setLoginAccount = useSetLoginAccount();

  const [guardian, setGuardian] = useState(guardianRouter);
  useEffect(() => {
    setGuardian(guardianRouter);
  }, [guardianRouter]);

  useEffect(() => {
    const listener = myEvents.setLoginAccount.addListener(({ guardian: _guardian }: { guardian: UserGuardianItem }) => {
      setGuardian(pre => {
        if (pre?.key !== _guardian.key) return pre;
        return {
          ...pre,
          isLoginAccount: _guardian.isLoginAccount,
        };
      });
    });
    return () => {
      listener.remove();
    };
  }, []);

  const onLoginAccountChange = useCallback(
    async (value: boolean) => {
      console.log('guardian value', value);
      if (guardian === undefined || userGuardiansList === undefined) return;

      if (!value) {
        const isLastLoginAccount = checkIsLastLoginAccount(userGuardiansList, guardian);
        if (isLastLoginAccount) {
          ActionSheet.alert({
            title2: 'This guardian is the only login account and cannot be turned off',
            buttons: [
              {
                title: 'Close',
              },
            ],
          });
          return;
        }

        setLoginAccount(guardian, false);
        return;
      }

      const loginIndex = userGuardiansList.findIndex(
        item =>
          item.isLoginAccount &&
          item.guardianType === guardian.guardianType &&
          item.guardianAccount === guardian.guardianAccount &&
          item.verifier?.id !== guardian.verifier?.id,
      );
      if (loginIndex === -1) {
        Loading.show();
        try {
          const guardiansInfo = await getGuardiansInfo({ guardianIdentifier: guardian.guardianAccount });
          if (guardiansInfo?.guardianList?.guardians?.length) {
            throw { code: '20004' };
          }
        } catch (error: any) {
          if (error.code === '20004') {
            Loading.hide();
            ActionSheet.alert({
              title2: 'This account address is already a login account and cannot be used',
              buttons: [
                {
                  title: 'Close',
                },
              ],
            });
            return;
          }
          if (error.code !== '3002') {
            CommonToast.fail('Setup failed');
            return;
          }
        } finally {
          Loading.hide();
        }
      }

      setLoginAccount(guardian, true);
    },
    [getGuardiansInfo, guardian, setLoginAccount, userGuardiansList],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={'Guardians'}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        <View style={pageStyles.guardianInfoWrap}>
          <GuardianAccountItem guardian={guardian} />
          <Divider style={pageStyles.dividerStyle} />
          <View style={pageStyles.verifierInfoWrap}>
            <VerifierImage
              style={pageStyles.verifierImageStyle}
              size={pTd(28)}
              label={guardian?.verifier?.name}
              uri={guardian?.verifier?.imageUrl}
            />
            <TextL>{guardian?.verifier?.name || ''}</TextL>
          </View>
        </View>

        <View style={pageStyles.loginSwitchWrap}>
          <TextM>{'Login account'}</TextM>
          <CommonSwitch
            value={guardian === undefined ? false : guardian.isLoginAccount}
            onValueChange={onLoginAccountChange}
          />
        </View>

        <TextM style={pageStyles.tips}>{'The login account will be able to log in and control all your assets'}</TextM>
      </View>
      {userGuardiansList && userGuardiansList.length > 1 && (
        <CommonButton
          type="primary"
          onPress={() => {
            navigationService.navigate('GuardianEdit', {
              guardian: JSON.parse(JSON.stringify(guardian)),
              isEdit: true,
            });
          }}>
          {'Edit'}
        </CommonButton>
      )}
    </PageContainer>
  );
}
