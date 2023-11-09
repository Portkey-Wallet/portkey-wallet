import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { getTempWalletConfig, RecoverWalletConfig } from 'model/verify/after-verify';
import { NetworkController } from 'network/controller';
import { PortkeyConfig } from 'global/constants';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { getBottomSpace } from 'utils/screen';
import { GuardianInfo } from 'network/dto/guardian';
import { guardianTypeStrToEnum } from 'model/global';

export default function GuardianHome() {
  const { t } = useLanguage();

  const [guardianList, setGuardianList] = useState<GuardianInfo[]>([]);
  const userGuardiansList = useMemo(() => {
    if (!guardianList) return [];
    return guardianList
      .map((item, index) => {
        const parsedItem = {
          ...item,
          guardianAccount: item.guardianIdentifier,
          isLoginAccount: item.isLoginGuardian,
          guardianType: guardianTypeStrToEnum(item.type as 'Apple' | 'Google' | 'Email' | 'Phone'),
          key: `${index}`,
          identifierHash: '',
        } as UserGuardianItem;
        return parsedItem;
      })
      .reverse();
  }, [guardianList]);

  useEffect(() => {
    (async () => {
      const config: RecoverWalletConfig = await getTempWalletConfig();
      const chainId = (await PortkeyConfig.currChainId()) ?? config.originalChainId;
      const guardianInfo = await NetworkController.getGuardianInfo(
        chainId,
        config.accountIdentifier as string,
        config?.caInfo?.caHash,
      );
      if (guardianInfo?.guardianList?.guardians) {
        setGuardianList(guardianInfo?.guardianList?.guardians);
      }
    })();
  }, []);

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
          style={{ padding: pTd(16) }}
          onPress={() => {
            // navigationService.navigate('GuardianEdit');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }>
      <View>
        {userGuardiansList.map((guardian, idx) => (
          <Touchable
            key={idx}
            onPress={() => {
              // navigationService.navigate('GuardianDetail', { guardian });
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
    paddingBottom: getBottomSpace(),
    ...GStyles.paddingArg(16, 20),
  },
});
