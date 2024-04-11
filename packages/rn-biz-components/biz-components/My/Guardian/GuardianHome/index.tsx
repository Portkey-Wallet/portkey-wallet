import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import PageContainer from '@portkey-wallet/rn-components/components//PageContainer';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { useGuardiansInfo } from '@portkey-wallet/rn-base/hooks/store';
import GuardianItem from '../../../Guardian/components/GuardianItem';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { useRefreshGuardianList } from '@portkey-wallet/rn-base/hooks/guardian';
import useEffectOnce from '@portkey-wallet/rn-base/hooks/useEffectOnce';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';

export default function GuardianHome() {
  const { t } = useLanguage();

  const { userGuardiansList, verifierMap } = useGuardiansInfo();
  const guardianList = useMemo(() => {
    if (!userGuardiansList) return [];
    return [...userGuardiansList].reverse();
  }, [userGuardiansList]);

  const { init } = useRefreshGuardianList();
  useEffectOnce(() => {
    init();
  });

  const renderGuardianBtn = useCallback(
    () => <Svg icon="right-arrow" color={defaultColors.icon1} size={pTd(16)} />,
    [],
  );

  const isAddAllowed = useMemo(() => {
    if (guardianList.length === 0) return false;
    const verifierNum = Object.keys(verifierMap || {}).length;
    const guardianVerifierMap: Record<string, boolean> = {};
    guardianList.forEach(item => (guardianVerifierMap[item.verifier?.id || ''] = true));
    const guardianVerifierNum = Object.keys(guardianVerifierMap).length;
    return verifierNum > guardianVerifierNum;
  }, [guardianList, verifierMap]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Guardians')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        isAddAllowed && (
          <Touchable
            style={{ padding: pTd(16) }}
            onPress={() => {
              navigationService.navigate('GuardianEdit');
            }}>
            <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
          </Touchable>
        )
      }>
      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
      {!isAddAllowed && (
        <View style={pageStyles.warnWrap}>
          <Svg icon="warning2" size={pTd(16)} color={defaultColors.icon1} />
          <TextM style={pageStyles.warnLabelWrap}>
            {'The number of guardians has reached the maximum limit. Please delete some before trying to add new ones.'}
          </TextM>
        </View>
      )}
    </PageContainer>
  );
}

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(16, 20, 10, 20),
  },
  warnWrap: {
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    padding: pTd(12),
    flexDirection: 'row',
  },
  warnLabelWrap: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
    flex: 1,
  },
});
