import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { TextM, TextXXXL } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import OverlayModal from 'components/OverlayModal';

const list = [1, 2, 3, 4, 5];

const GroupInfoPage = () => {
  const isGroupHolder = true;

  const onLeave = useCallback(() => {
    return ActionSheet.alert({
      autoClose: false,
      title: 'Leave the group?',
      buttons: [
        {
          title: 'No',
          type: 'outline',
        },
        {
          title: 'Yes',
          onPress: () => {
            // TODO: api
            try {
              Loading.show();
              // TODO: api
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              OverlayModal.hide();
              Loading.hide();
            }
          },
        },
      ],
    });
  }, []);

  return (
    <PageContainer
      hideTouchable
      titleDom="Group Info"
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      {/* TODO: real data */}
      <View style={[GStyles.center, styles.headerWrap]}>
        <CommonAvatar avatarSize={pTd(80)} svgName="add-blue" />
        <TextXXXL numberOfLines={1} style={GStyles.marginTop(pTd(8))}>
          name
        </TextXXXL>
        <TextM style={[GStyles.marginTop(pTd(4)), FontStyles.font7]}>{100 + 'members'}</TextM>
      </View>

      <ScrollView>
        {list.map(ele => (
          <View key={ele}>
            <TextM>{ele}</TextM>
          </View>
        ))}
      </ScrollView>

      <TextM
        style={styles.buttonStyle}
        onPress={() => {
          // TODO add
          navigationService.navigate('AddMembersPage');
        }}>
        Add Member
      </TextM>

      <TextM
        style={styles.buttonStyle}
        onPress={() => {
          // TODO remove
          navigationService.navigate('RemoveMembersPage');
        }}>
        Remove Member
      </TextM>

      <TextM
        style={styles.buttonStyle}
        onPress={() => {
          navigationService.navigate('GroupMembersPage');
        }}>
        View more
      </TextM>
      <TextM
        style={styles.buttonStyle}
        onPress={() => {
          navigationService.navigate('TransferOwnershipPage');
        }}>
        Transfer Ownership
      </TextM>

      <View style={styles.buttonWrap}>
        {isGroupHolder ? (
          <CommonButton type="primary" title={'Edit'} onPress={() => navigationService.navigate('EditGroupPage')} />
        ) : (
          <CommonButton
            type="outline"
            onPress={onLeave}
            title={'Leave Group'}
            buttonStyle={styles.leaveButtonStyle}
            titleStyle={styles.leaveTitleStyle}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default GroupInfoPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerWrap: {
    width: screenWidth,
    marginTop: pTd(24),
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
  buttonStyle: {
    height: 50,
    backgroundColor: 'red',
  },
  leaveButtonStyle: {
    borderColor: defaultColors.bg7,
    marginBottom: StyleSheet.hairlineWidth,
  },
  leaveTitleStyle: {
    color: defaultColors.font12,
  },
});
