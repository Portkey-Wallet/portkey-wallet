import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { useGuardiansInfo } from 'hooks/store';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Touchable from 'components/Touchable';
import { useRefreshGuardianList } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';

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
          <TouchableOpacity
            style={{ padding: pTd(16) }}
            onPress={() => {
              navigationService.navigate('GuardianEdit');
            }}>
            <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
          </TouchableOpacity>
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
