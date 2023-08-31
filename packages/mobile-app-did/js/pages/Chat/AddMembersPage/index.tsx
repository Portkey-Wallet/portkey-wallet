import React from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

import ChatsDetailContent from '../components/ChatsDetailContent';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';

import { useAppCommonDispatch } from '@portkey-wallet/hooks';

const AddMembersPage = () => {
  const dispatch = useAppCommonDispatch();

  return (
    <PageContainer
      noCenterDom
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <ChatsDetailContent />
    </PageContainer>
  );
};

export default AddMembersPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
});
