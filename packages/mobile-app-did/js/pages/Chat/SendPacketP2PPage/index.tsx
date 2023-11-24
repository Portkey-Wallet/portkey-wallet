import React from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection from '../components/SendRedPacketGroupSection';

const SendPacketP2PPage = () => {
  return (
    <PageContainer
      titleDom="Send Red Packet"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: false }}
      containerStyles={styles.container}>
      <SendRedPacketGroupSection type="p2p" />
    </PageContainer>
  );
};

export default SendPacketP2PPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(24, 20),
  },
  groupNameWrap: {
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginHorizontal: pTd(20),
    marginVertical: pTd(24),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  selectHeaderWrap: {
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  inputWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(8),
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.paddingArg(10, 20, 16),
    backgroundColor: defaultColors.bg1,
  },
  nameInputStyle: {
    fontSize: pTd(16),
  },
  nameInputContainerStyle: {
    flex: 1,
  },
  nameInputErrorStyle: {
    height: 0,
    padding: 0,
    margin: 0,
  },
});
