import React from 'react';
import Svg from 'components/Svg';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
export interface IHeaderCardProps {
  showViewDetails?: boolean;
  memo?: string;
  giftId?: string;
}
export default function HeaderCard(props: IHeaderCardProps) {
  const { showViewDetails, memo, giftId } = props;
  return (
    <View style={styles.container}>
      <Svg icon="gift-box-close" oblongSize={[pTd(171.5), pTd(120)]} />
      <View style={styles.titleWrapper}>
        {showViewDetails && <Svg icon="success" size={pTd(20)} iconStyle={styles.icon} />}
        <TextL style={{ ...fonts.mediumFont }}>{memo ? `"${memo}"` : `The crypto gift is packaged.`}</TextL>
      </View>
      {showViewDetails && (
        <TouchableOpacity
          onPress={() => {
            navigationService.pop(2);
            navigationService.navigate('GiftDetail', {
              id: giftId,
            });
          }}>
          <TextM style={[FontStyles.brandNormal, GStyles.marginTop(pTd(8))]}>View Details</TextM>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: pTd(8),
  },
});
