import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';

import Chats from '../components/Chats';

const ChatDetails = () => {
  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}
      titleDom={
        <View style={GStyles.flexRow}>
          <Image
            source={{ uri: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg' }}
            style={{ width: 40, height: 40 }}
          />
          <TextM>Mason</TextM>
        </View>
      }>
      <Chats />
    </PageContainer>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
