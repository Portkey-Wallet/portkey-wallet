import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import { useGuardiansInfo } from 'hooks/store';
import { useGetGuardiansInfo } from 'hooks/guardian';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { RouteProp, useRoute } from '@react-navigation/native';
import GuardianAccountItem from '../components/GuardianAccountItem';
import Divider from 'components/Divider';
import { checkIsLastLoginAccount } from '@portkey-wallet/utils/guardian';
import { useSetLoginAccount } from '../hooks/useSetLoginAccount';
import myEvents from 'utils/deviceEvent';
import { zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import { isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';

type RouterParams = {
  guardian?: UserGuardianItem;
};

export default function GuardianDetail() {
  const {
    params: { guardian: guardianRouter },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
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

  const verifierName = useMemo(() => {
    if (guardian && isZKLoginSupported(guardian.guardianType) && guardian?.verifiedByZk) {
      return zkLoginVerifierItem.name;
    }
    return guardian?.verifier?.name;
  }, [guardian]);

  const verifierImage = useMemo(() => {
    if (guardian && isZKLoginSupported(guardian.guardianType) && guardian?.verifiedByZk) {
      return zkLoginVerifierItem.imageUrl;
    }
    return guardian?.verifier?.imageUrl;
  }, [guardian]);

  return (
    <PageContainer
      safeAreaColor={['white', 'gray']}
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
              label={verifierName}
              uri={verifierImage}
            />
            <TextL>{verifierName || ''}</TextL>
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
