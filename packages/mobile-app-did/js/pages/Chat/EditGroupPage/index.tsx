import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import { pTd } from 'utils/unit';
import { useCurrentChannelId } from '../context/hooks';
import { useDisbandChannel, useGroupChannelInfo, useUpdateChannelName } from '@portkey-wallet/hooks/hooks-ca/im';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import { useInputFocus } from 'hooks/useInputFocus';

const EditGroupPage = () => {
  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);

  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', false);
  const { name } = groupInfo || {};
  const disbandGroup = useDisbandChannel(currentChannelId || '');
  const upDateChannelName = useUpdateChannelName();
  const [groupName, setGroupName] = useState(name || '');

  const onDisband = useCallback(() => {
    ActionSheet.alert({
      title: 'Are you sure leave and delete the group ?',
      buttons: [
        {
          title: 'No',
          type: 'outline',
        },
        {
          title: 'Yes',
          onPress: async () => {
            try {
              Loading.show();
              await disbandGroup();
              CommonToast.success('Group deleted');
              navigationService.navigate('Tab');
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }
          },
        },
      ],
    });
  }, [disbandGroup]);

  const onSave = useCallback(async () => {
    try {
      Loading.show();
      await upDateChannelName(currentChannelId || '', groupName?.trim());
      CommonToast.success('Save successfully');
      navigationService.goBack();
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [currentChannelId, groupName, upDateChannelName]);

  return (
    <PageContainer
      titleDom="Edit Group"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <ScrollView style={GStyles.flex1}>
        <FormItem title={'Group Name'} style={styles.groupNameWrap}>
          <CommonInput
            ref={iptRef}
            type="general"
            theme="white-bg"
            placeholder="Enter Name"
            maxLength={40}
            value={groupName}
            onChangeText={setGroupName}
          />
        </FormItem>
      </ScrollView>

      <View style={styles.buttonWrap}>
        <CommonButton disabled={!groupName} title="Save" type="primary" onPress={onSave} />
        <CommonButton
          title={'Leave and Delete'}
          style={styles.deleteBtnStyle}
          onPress={onDisband}
          titleStyle={FontStyles.font12}
          type="clear"
        />
      </View>
    </PageContainer>
  );
};

export default EditGroupPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  groupNameWrap: {
    marginTop: pTd(24),
    paddingHorizontal: pTd(20),
  },
  deleteBtnStyle: {
    marginTop: pTd(8),
  },
  buttonWrap: {
    ...GStyles.paddingArg(10, 20, 16),
  },
});
