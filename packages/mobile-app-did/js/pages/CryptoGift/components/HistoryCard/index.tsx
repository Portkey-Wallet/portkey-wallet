import React from 'react';
import { TextL, TextM, TextS } from 'components/CommonText';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
export interface IHistoryCardProps {
  containerStyle?: StyleProp<ViewStyle>;
  showTitle?: boolean;
  // isSkeleton?: boolean;
}
export default function HistoryCard(props: IHistoryCardProps) {
  const { showTitle } = props;
  return (
    <View style={[styles.historyContainer, props.containerStyle]}>
      {showTitle && (
        <View style={styles.titleContainer}>
          <TextL style={styles.textTitle}> History</TextL>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // todo goto history list
              navigationService.navigate('GiftHistory');
            }}>
            <View style={styles.rightIcon}>
              <TextS style={[FontStyles.brandNormal, styles.viewAll]}> View All</TextS>
              <Svg icon="right-arrow2" size={pTd(12)} color={defaultColors.brandNormal} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // todo goto this card
          navigationService.navigate('GiftDetail');
        }}>
        <View style={styles.historyCard}>
          <View style={styles.cardPart1}>
            <View style={styles.giftIconBg}>
              <Svg icon="crypto-gift" size={pTd(12)} />
            </View>
            <TextM style={styles.text}>Claim and Join Portkey</TextM>
            <View style={styles.statusContainer}>
              <TextS style={styles.statusText}>In Progress</TextS>
            </View>
          </View>
          {/* <Text style={styles.dateText}>May 28 at 4:11 pm</Text> */}
          <View style={styles.dateContainer}>
            <TextS style={styles.dateText}>May 28 at 4:11 pm</TextS>
          </View>
          <View style={styles.divider} />
          <View style={styles.claimContainer}>
            <TextS style={styles.claimText}>Claimed:</TextS>
            <TextS style={styles.claimValue}>0.00000005 / 0.00000008 ELF</TextS>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  historyContainer: {},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(6),
  },
  rightIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    marginRight: pTd(4),
  },
  textTitle: {
    // fontStyle: 'italic',
    // fontSize: 20,
    // fontWeight: 'normal',
  },
  historyCard: {
    flexDirection: 'column',
    height: pTd(98),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.neutralBorder,
    borderRadius: pTd(6),
    padding: pTd(12),
  },
  cardPart1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIconBg: {
    backgroundColor: defaultColors.functionalRedLight,
    padding: pTd(6),
    borderRadius: pTd(40),
  },
  text: {
    flex: 1,
    marginLeft: pTd(8),
  },
  statusContainer: {
    paddingLeft: pTd(6),
    paddingRight: pTd(6),
    paddingTop: pTd(3),
    paddingBottom: pTd(3),
    backgroundColor: defaultColors.brandLight,
    borderRadius: pTd(4),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  statusText: {
    textAlign: 'right',
    color: defaultColors.brandNormal,
  },

  dateContainer: {
    paddingLeft: pTd(32),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pTd(2),
  },
  dateText: {
    color: defaultColors.neutralTertiaryText,
  },
  divider: {
    marginLeft: pTd(32),
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.neutralDivider,
    marginVertical: pTd(8),
  },
  claimContainer: {
    flexDirection: 'row',
    paddingLeft: 32,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  claimText: {
    textAlign: 'right',
  },
  claimValue: {
    flex: 1,
    marginLeft: pTd(12),
    // color: '#101114',
    // fontSize: 12,
    // fontWeight: '400',
    // lineHeight: 16,
  },
});
