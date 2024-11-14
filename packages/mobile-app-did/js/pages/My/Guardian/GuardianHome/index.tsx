import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { useGuardiansInfo } from 'hooks/store';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Touchable from 'components/Touchable';
import { TextM } from 'components/CommonText';
import { useRefreshGuardianList } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import GStyles from 'assets/theme/GStyles';
import { makeStyles, useTheme } from '@rneui/themed';

export default function GuardianHome() {
  const { t } = useLanguage();
  const pageStyles = getPageStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { userGuardiansList } = useGuardiansInfo();
  const guardianList = useMemo(() => {
    if (!userGuardiansList) return [];
    return [...userGuardiansList].reverse();
  }, [userGuardiansList]);

  const { init } = useRefreshGuardianList();
  useEffectOnce(() => {
    init();
  });

  const renderGuardianBtn = useCallback(() => <Svg icon="chevron-right" oblongSize={[pTd(7), pTd(12)]} />, []);
  const loginGuardians = useMemo(
    () => (userGuardiansList || []).filter(item => item.isLoginAccount),
    [userGuardiansList],
  );
  const otherGuardians = useMemo(
    () => (userGuardiansList || []).filter(item => !item.isLoginAccount),
    [userGuardiansList],
  );
  const onDocPress = useCallback(() => {
    const url = `https://doc.portkey.finance/docs/What-are-guardians-and-verifiers`;
    navigationService.navigate('ViewOnWebView', {
      title: 'What are guardians and verifiers',
      url,
    });
  }, []);

  return (
    <PageContainer
      safeAreaColor={['black', 'black']}
      titleDom={t('Guardians')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        <Touchable
          style={{ paddingRight: pTd(16) }}
          onPress={() => {
            navigationService.navigate('GuardianEdit');
          }}>
          <Svg icon="add4" size={pTd(24)} color={colors.iconBase1} />
        </Touchable>
      }>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loginGuardians.length > 0 && (
          <>
            <View style={pageStyles.guardiansTitleWrap}>
              <TextM style={pageStyles.guardiansTitle}>{'Login account(s)'}</TextM>
            </View>
            {loginGuardians.map((guardian, idx) => (
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
          </>
        )}
        {otherGuardians.length > 0 && (
          <>
            <View style={pageStyles.guardiansTitleWrap}>
              <TextM style={pageStyles.guardiansTitle}>{'Other guardian(s)'}</TextM>
            </View>
            {otherGuardians.map((guardian, idx) => (
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
          </>
        )}
        <Touchable style={pageStyles.guardianDocWrap} onPress={onDocPress}>
          <TextM style={pageStyles.guardianDocText}>Learn more about account guardians</TextM>
        </Touchable>
      </ScrollView>
    </PageContainer>
  );
}

const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(0, 16, 0),
  },
  guardiansTitleWrap: {
    height: pTd(44),
    paddingTop: pTd(16),
    paddingBottom: pTd(8),
  },
  guardiansTitle: {
    color: theme.colors.textBase2,
  },
  warnWrap: {
    backgroundColor: theme.colors.bg6,
    borderRadius: pTd(6),
    padding: pTd(12),
    flexDirection: 'row',
  },
  warnLabelWrap: {
    color: theme.colors.font3,
    marginLeft: pTd(8),
    flex: 1,
  },
  guardianDocWrap: {
    marginTop: pTd(24),
  },
  guardianDocText: {
    color: theme.colors.textBrand1,
  },
}));
