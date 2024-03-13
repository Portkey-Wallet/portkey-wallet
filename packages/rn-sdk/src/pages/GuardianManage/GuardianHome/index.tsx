import { defaultColors } from 'assets/theme';
import CommonSvg from 'components/Svg';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { AccountOriginalType, getTempWalletConfig, RecoverWalletConfig } from 'model/verify/core';
import { NetworkController } from 'network/controller';
import { getBottomSpace } from 'utils/screen';
import { GuardianInfo } from 'network/dto/guardian';
import { guardianTypeStrToEnum, parseGuardianInfo } from 'model/global';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { GuardianVerifyType } from 'model/verify/social-recovery';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { ModifyGuardianProps } from 'pages/Guardian/GuardianManage/ModifyGuardian';
import { PortkeyConfig } from 'global/constants';
import { OperationTypeEnum } from 'packages/types/verifier';
import { Verifier, getVerifierData } from 'model/contract/handler';
import { UserGuardianItem } from 'packages/store/store-ca/guardians/type';

export default function GuardianHome({ containerId }: { containerId: any }) {
  const { t } = useLanguage();

  const [verifierMap, setVerifierMap] = useState<{
    [key: string]: any;
  }>([] as any);
  const verifierList: Array<Verifier> = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  useEffectOnce(async () => {
    Loading.show();
    const { data } = await getVerifierData();
    const { verifierServers: verifiers } = data || {};
    console.log('verifiers', JSON.stringify(verifiers));
    verifiers && setVerifierMap(verifiers);
    await refreshGuardianInfo();
    Loading.hide();
  });

  const { navigateTo, navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.GUARDIAN_HOME_ENTRY,
    onNewIntent: async (intent: GuardiansApprovalIntent) => {
      switch (intent.type) {
        case GuardianVerifyType.ADD_GUARDIAN: {
          if (intent.result === 'success') {
            CommonToast.success('Add guardian success', 1000);
          } else {
            CommonToast.fail('Add guardian fail');
          }
          break;
        }
        case GuardianVerifyType.MODIFY_GUARDIAN: {
          if (intent.result === 'success') {
            CommonToast.success('Edit guardian success', 1000);
          } else {
            CommonToast.fail('Edit guardian fail');
          }
          break;
        }
        case GuardianVerifyType.REMOVE_GUARDIAN: {
          if (intent.result === 'success') {
            CommonToast.success('Remove guardian success', 1000);
          } else {
            CommonToast.fail('Remove guardian fail');
          }
          break;
        }
      }
    },
    onShow: async () => {
      Loading.show();
      await refreshGuardianInfo();
      Loading.hide();
    },
    containerId,
  });

  const [guardianList, setGuardianList] = useState<GuardianInfo[]>([]);
  const userGuardiansList = useMemo(() => {
    if (!guardianList) return [];
    return guardianList
      .map((item, index) => {
        const verifier = verifierList.find(v => v.id === item.verifierId);
        const parsedItem = {
          ...item,
          identifierHash: item.identifierHash,
          guardianAccount: item.guardianIdentifier,
          isLoginAccount: item.isLoginGuardian,
          guardianType: guardianTypeStrToEnum(item.type as 'Apple' | 'Google' | 'Email' | 'Phone'),
          key: `${index}`,
          verifier,
        } as UserGuardianItem;
        return parsedItem;
      })
      .reverse();
  }, [guardianList, verifierList]);

  const refreshGuardianInfo = useCallback(async () => {
    const config: RecoverWalletConfig = await getTempWalletConfig();
    const guardianInfo = await NetworkController.getGuardianInfo(
      config.accountIdentifier as string,
      config?.caInfo?.caHash,
    );
    if (guardianInfo?.guardianList?.guardians) {
      setGuardianList(guardianInfo?.guardianList?.guardians);
    }
  }, []);

  const renderGuardianBtn = useCallback(
    () => <CommonSvg icon="right-arrow" color={defaultColors.icon1} size={pTd(16)} />,
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
            navigateTo(PortkeyEntries.ADD_GUARDIAN_ENTRY, {});
          }}>
          <CommonSvg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }>
      <View>
        {userGuardiansList.map((guardian, idx) => (
          <Touchable
            key={idx}
            onPress={async () => {
              const chainId = await PortkeyConfig.currChainId();
              navigateForResult(PortkeyEntries.GUARDIAN_DETAIL_ENTRY, {
                closeCurrentScreen: false,
                params: {
                  info: JSON.stringify({
                    particularGuardianInfo: parseGuardianInfo(
                      guardianList[Number(guardian.key)],
                      chainId,
                      [],
                      undefined,
                      '',
                      AccountOriginalType.Email,
                      OperationTypeEnum.editGuardian,
                    ),
                    originalGuardianItem: guardian,
                  } as ModifyGuardianProps),
                },
              });
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

export interface GuardiansApprovalIntent {
  type: GuardianVerifyType;
  result: 'success' | 'fail' | 'cancel' | 'system';
  extra?: any;
}

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    paddingBottom: getBottomSpace(),
    ...GStyles.paddingArg(16, 20),
  },
});
