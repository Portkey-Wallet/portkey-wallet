import React from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';

const ChatSettingsPage = () => {
  // todo: change to enum
  const list = [
    {
      value: 1,
      name: 'Everybody',
    },
    {
      value: 2,
      name: 'My Contacts',
    },
    {
      value: 3,
      name: 'Nobody',
    },
  ];

  return (
    <PageContainer
      titleDom="Chat Settings"
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.pageWrap}>
      <TextM style={[GStyles.marginLeft(8), GStyles.marginBottom(8), FontStyles.font3]}>Who can add me to group</TextM>
      {list.map(item => (
        <Touchable key={item.value}>
          <View style={styles.networkItemWrap}>
            <TextM style={GStyles.flex1}>{item.name}</TextM>
            {item && <Svg icon={'selected'} size={pTd(20)} />}
          </View>
        </Touchable>
      ))}
    </PageContainer>
  );
};

export default ChatSettingsPage;

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg6,
    ...GStyles.paddingArg(24, 20, 0),
  },
  networkItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(56),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(8),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
  },
});
