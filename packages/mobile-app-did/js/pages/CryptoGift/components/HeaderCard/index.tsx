import React from 'react';
import Svg from 'components/Svg';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import boxClose from 'assets/image/pngs/box-close.png';
import { Image } from 'react-native';

export interface IHeaderCardProps {
  showViewDetails?: boolean;
  memo?: string;
  giftId?: string;
}
export default function HeaderCard(props: IHeaderCardProps) {
  const { showViewDetails, memo, giftId } = props;
  return (
    <View style={styles.container}>
      <Image resizeMode="contain" source={boxClose} style={{ width: pTd(171.5), height: pTd(120) }} />
      <View style={styles.titleWrapper}>
        {showViewDetails && <Svg icon="success" size={pTd(20)} iconStyle={styles.icon} />}
        <TextL style={{ ...fonts.mediumFont }}>
          {memo ? `"${memo}"` : showViewDetails ? `The crypto gift is packaged.` : ''}
        </TextL>
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
    paddingHorizontal: pTd(16),
  },
  icon: {
    marginRight: pTd(8),
  },
});
