import React, { useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { ContactPermissionEnum, IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import Svg from 'components/Svg';
import { LoginGuardianTypeIcon } from 'constants/misc';
import ListItem from 'components/ListItem';
import {
  CONTACT_PERMISSION_LABEL_MAP,
  CONTACT_PERMISSION_LIST,
  CONTACT_PRIVACY_TYPE_LABEL_MAP,
  CONTACT_PRIVACY_TYPE_LOWER_LABEL_MAP,
} from '@portkey-wallet/constants/constants-ca/contact';
import ActionSheet from 'components/ActionSheet';
import Loading from 'components/Loading';
import { sleep } from '@portkey-wallet/utils';
import { useContactPrivacyList } from '@portkey-wallet/hooks/hooks-ca/security';
import CommonToast from 'components/CommonToast';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

interface RouterParams {
  detail: IContactPrivacy;
}

const EditChatPrivacy: React.FC = () => {
  const { detail } = useRouterParams<RouterParams>();
  const [permission, setPermission] = useState(detail.permission);
  const { update } = useContactPrivacyList();

  const updatePrivacyPermission = useLockCallback(
    (value: ContactPermissionEnum) => {
      if (value === permission) return;
      ActionSheet.alert({
        title: `You are about to switch to ${CONTACT_PERMISSION_LABEL_MAP[value]}`,
        message: `After confirmation, your account information will be displayed according to the rules`,
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
          },
          {
            title: 'Confirm',
            onPress: async () => {
              Loading.show();
              try {
                await update({
                  ...detail,
                  permission: value,
                });

                await sleep(1000);
                setPermission(value);
              } catch (error) {
                CommonToast.failError(error);
                console.log('updatePrivacyPermission: error', error);
              }
              Loading.hide();
            },
          },
        ],
      });
    },
    [detail, permission, update],
  );

  return (
    <PageContainer
      titleDom={CONTACT_PRIVACY_TYPE_LABEL_MAP[detail.privacyType]}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={[FontStyles.font3, pageStyles.title]}>{`My login ${
        CONTACT_PRIVACY_TYPE_LABEL_MAP[detail.privacyType]
      }`}</TextM>
      <View style={pageStyles.infoWrap}>
        <Svg icon={LoginGuardianTypeIcon[detail.privacyType]} size={pTd(28)} />
        <TextM numberOfLines={1} style={pageStyles.infoLabel}>
          {detail.identifier}
        </TextM>
      </View>

      <TextM style={[FontStyles.font3, pageStyles.title]}>{`Who can see my ${
        CONTACT_PRIVACY_TYPE_LOWER_LABEL_MAP[detail.privacyType]
      }`}</TextM>

      {CONTACT_PERMISSION_LIST.map(item => (
        <ListItem
          key={item.value}
          style={pageStyles.permissionItemWrap}
          title={item.label}
          onPress={() => {
            updatePrivacyPermission(item.value);
          }}
          rightElement={permission === item.value ? <Svg icon={'selected'} size={pTd(20)} /> : null}
        />
      ))}
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0, 20, 18),
  },
  title: {
    marginTop: pTd(24),
    marginBottom: pTd(8),
    paddingLeft: pTd(8),
  },
  infoWrap: {
    height: pTd(56),
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    flexDirection: 'row',
  },
  infoLabel: {
    flex: 1,
    marginLeft: pTd(12),
  },
  permissionItemWrap: {
    marginBottom: pTd(8),
  },
});

export default EditChatPrivacy;
