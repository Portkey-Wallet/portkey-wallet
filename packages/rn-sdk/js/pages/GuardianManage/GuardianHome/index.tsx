import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import GStyles from 'assets/theme/GStyles';
import { getTempWalletConfig, RecoverWalletConfig } from 'model/verify/after-verify';
import { NetworkController } from 'network/controller';
import { PortkeyConfig } from 'global/constants';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { getStatusBarHeight, getBottomSpace } from 'utils/screen';

export default function GuardianHome() {
  const { t } = useLanguage();

  // const { userGuardiansList } = useGuardiansInfo();
  // const guardianList = useMemo(() => {
  //   if (!userGuardiansList) return [];
  //   return [...userGuardiansList].reverse();
  // }, [userGuardiansList]);
  const [guardianList, setGuardianList] = useState<UserGuardianItem[]>([]);

  useEffect(() => {
    (async () => {
      const config: RecoverWalletConfig = await getTempWalletConfig();
      // console.log('config', config);
      const chainId = (await PortkeyConfig.currChainId()) ?? config.originalChainId;
      const guardianInfo = await NetworkController.getGuardianInfo(
        chainId,
        config.accountIdentifier as string,
        config?.caInfo?.caHash,
      );
      console.log('guardianInfo： ', JSON.stringify(guardianInfo));
      if (guardianInfo?.guardianList?.guardians) {
        setGuardianList(guardianInfo?.guardianList?.guardians);
      }
    })();
  }, []);

  /*
  const { caHash } = useCurrentWalletInfo();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const getVerifierServers = useGetVerifierServers();
  const refreshGuardiansList = useCallback(async () => {
    try {
      await getGuardiansInfoWriteStore({
        caHash,
      });
    } catch (error) {
      console.log(error);
    }
  }, [caHash, getGuardiansInfoWriteStore]);

  const init = useCallback(async () => {
    try {
      await getVerifierServers();
      refreshGuardiansList();
    } catch (error) {
      console.log(error, '==error');
    }
  }, [getVerifierServers, refreshGuardiansList]);
  useEffectOnce(() => {
    init();
  });

  useEffect(() => {
    const listener = myEvents.refreshGuardiansList.addListener(() => {
      refreshGuardiansList();
    });
    return () => {
      listener.remove();
    };
  }, [refreshGuardiansList]);
  */

  const renderGuardianBtn = useCallback(
    () => <Svg icon="right-arrow" color={defaultColors.icon1} size={pTd(16)} />,
    [],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Guardians')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: false }}
      rightDom={
        <TouchableOpacity
          style={{ padding: pTd(16), backgroundColor: 'red' }}
          onPress={() => {
            navigationService.navigate('GuardianEdit');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }>
      <View>
        {guardianList.map((guardian, idx) => (
          <Touchable
            key={idx}
            onPress={() => {
              navigationService.navigate('GuardianDetail', { guardian });
            }}>
            <GuardianItem
              guardianItem={guardian}
              isButtonHide
              renderBtn={renderGuardianBtn}
              isBorderHide={idx === guardianList.length - 1}
            />
          </Touchable>
        ))}
      </View>
    </PageContainer>
  );
}

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    paddingTop: getStatusBarHeight(true),
    paddingBottom: getBottomSpace(),
    ...GStyles.paddingArg(16, 20),
  },
});
