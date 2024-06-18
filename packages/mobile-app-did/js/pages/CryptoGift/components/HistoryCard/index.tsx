import React, { useMemo } from 'react';
import { TextL, TextM, TextS } from 'components/CommonText';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import PortkeySkeleton from 'components/PortkeySkeleton';
import GStyles from 'assets/theme/GStyles';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { getClaimedShow } from 'pages/Chat/utils/format';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { CryptoGiftItem, CryptoGiftOriginalStatus } from '@portkey-wallet/types/types-ca/cryptogift';
import fonts from 'assets/theme/fonts';
export interface IHistoryCardProps {
  containerStyle?: StyleProp<ViewStyle>;
  showTitle?: boolean;
  redPacketDetail?: CryptoGiftItem;
  isSkeleton?: boolean;
}
export default function HistoryCard(props: IHistoryCardProps) {
  const { showTitle, redPacketDetail, isSkeleton } = props;
  console.log('wfs=== redPacketDetail', redPacketDetail);
  const statusStyles = useMemo(() => {
    if (
      redPacketDetail?.status === CryptoGiftOriginalStatus.Init ||
      redPacketDetail?.status === CryptoGiftOriginalStatus.NotClaimed ||
      redPacketDetail?.status === CryptoGiftOriginalStatus.Claimed
    ) {
      return {
        bg: {
          backgroundColor: defaultColors.brandLight,
        },
        textColor: {
          color: defaultColors.brandNormal,
        },
      };
    } else if (redPacketDetail?.status === CryptoGiftOriginalStatus.FullyClaimed) {
      return {
        bg: {
          backgroundColor: defaultColors.neutralContainerBG,
        },
        textColor: {
          color: defaultColors.neutralPrimaryTextColor,
        },
      };
    }
    return {
      bg: {
        backgroundColor: defaultColors.neutralContainerBG,
      },
      textColor: {
        color: defaultColors.neutralTertiaryText,
      },
    };
  }, [redPacketDetail?.status]);
  return (
    <View style={[styles.historyContainer, props.containerStyle]}>
      {showTitle && (
        <View style={styles.titleContainer}>
          <TextL style={styles.textTitle}>Crypto Gift Sent</TextL>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
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
          navigationService.navigate('GiftDetail', {
            id: redPacketDetail?.id,
          });
        }}>
        <View style={styles.historyCard}>
          {isSkeleton ? (
            <>
              <View style={styles.cardPart1}>
                <PortkeySkeleton width={pTd(24)} height={pTd(22)} />
                <PortkeySkeleton width={pTd(280)} height={pTd(22)} style={[GStyles.marginLeft(pTd(8))]} />
              </View>
              <PortkeySkeleton
                width={pTd(208)}
                height={pTd(16)}
                style={[GStyles.marginTop(pTd(2)), GStyles.marginLeft(pTd(32))]}
              />
              <PortkeySkeleton
                width={pTd(280)}
                height={pTd(16)}
                style={[GStyles.marginTop(pTd(16)), GStyles.marginLeft(pTd(32))]}
              />
            </>
          ) : (
            <>
              <View style={styles.cardPart1}>
                <View style={styles.giftIconBg}>
                  <Svg icon="crypto-gift" size={pTd(12)} />
                </View>
                <TextM style={styles.text} numberOfLines={1}>
                  {redPacketDetail?.memo || 'Best Wishes'}
                </TextM>
                {redPacketDetail?.displayStatus && (
                  <View style={[styles.statusContainer, statusStyles.bg]}>
                    <TextS style={[styles.statusText, statusStyles.textColor]}>{redPacketDetail?.displayStatus}</TextS>
                  </View>
                )}
              </View>
              {/* <Text style={styles.dateText}>May 28 at 4:11 pm</Text> */}
              <View style={styles.dateContainer}>
                <TextS style={styles.dateText}>{formatTransferTime(redPacketDetail?.createTime || 1)}</TextS>
              </View>
              <View style={styles.divider} />
              <View style={styles.claimContainer}>
                <TextS style={styles.claimText}>Claimed:</TextS>
                <TextS style={styles.claimValue}>
                  {getClaimedShow(
                    formatTokenAmountShowWithDecimals(redPacketDetail?.grabbedAmount, redPacketDetail?.decimals),
                    formatTokenAmountShowWithDecimals(redPacketDetail?.totalAmount, redPacketDetail?.decimals),
                    redPacketDetail?.label || redPacketDetail?.alias || redPacketDetail?.symbol || '--',
                  )}
                </TextS>
              </View>
            </>
          )}
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
    ...fonts.mediumFont,
  },
  historyCard: {
    flexDirection: 'column',
    height: pTd(98),
    borderWidth: StyleSheet.hairlineWidth,
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
    marginLeft: pTd(8),
  },
});
