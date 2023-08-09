import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { BGStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';

export default function RecommendSection() {
  return (
    <View style={styles.containerStyles}>
      <TextM>Recommend</TextM>
      <FlatList
        style={BGStyles.bg1}
        data={new Array(2)}
        renderItem={() => (
          <View style={GStyles.flexRow}>
            <TextM>Robot</TextM>
            <Touchable onPress={() => navigationService.navigate('ChatDetails')} style={styles.chatButton}>
              <TextM>chat!</TextM>
            </Touchable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
  chatButton: {
    backgroundColor: 'red',
  },
});
