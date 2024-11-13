import React, { useMemo } from 'react';
import { TextL, TextM, TextS } from 'components/CommonText';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import PortkeySkeleton from 'components/PortkeySkeleton';
import GStyles from 'assets/theme/GStyles';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { CryptoGiftItem, CryptoGiftOriginalStatus } from '@portkey-wallet/types/types-ca/cryptogift';
import fonts from 'assets/theme/fonts';
import { makeStyles, useTheme } from '@rneui/themed';
export interface IHistoryCardProps {
  containerStyle?: StyleProp<ViewStyle>;
  showTitle?: boolean;
  redPacketDetail?: CryptoGiftItem;
  isSkeleton?: boolean;
}
export default function HistoryCard(props: IHistoryCardProps) {
  const { showTitle, redPacketDetail, isSkeleton } = props;
  const styles = getStyles();
  console.log('wfs=== redPacketDetail', redPacketDetail);
  const { theme } = useTheme();
  const statusStyles = useMemo(() => {
    if (
      redPacketDetail?.status === CryptoGiftOriginalStatus.Init ||
      redPacketDetail?.status === CryptoGiftOriginalStatus.NotClaimed ||
      redPacketDetail?.status === CryptoGiftOriginalStatus.Claimed
    ) {
      return {
        bg: {
          backgroundColor: theme.colors.iconBrand6,
        },
        textColor: {
          color: theme.colors.textBrand5,
        },
      };
    } else if (redPacketDetail?.status === CryptoGiftOriginalStatus.FullyClaimed) {
      return {
        bg: {
          backgroundColor: theme.colors.bgBase2,
        },
        textColor: {
          color: theme.colors.textDisabled2,
        },
      };
    }
    return {
      bg: {
        backgroundColor: theme.colors.bgBase2,
      },
      textColor: {
        color: theme.colors.textDisabled2,
      },
    };
  }, [
    redPacketDetail?.status,
    theme.colors.bgBase2,
    theme.colors.iconBrand6,
    theme.colors.textBrand5,
    theme.colors.textDisabled2,
  ]);
  return (
    <View style={[styles.historyContainer, props.containerStyle]}>
      {showTitle && (
        <View style={styles.titleContainer}>
          <TextL style={[styles.textTitle, GStyles.lineHeight(pTd(24))]}>Crypto Gift Sent</TextL>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigationService.navigate('GiftHistory');
            }}>
            <View style={styles.rightIcon}>
              <TextS style={[FontStyles.brandNormal, styles.viewAll, GStyles.lineHeight(pTd(16))]}> View All</TextS>
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
                <PortkeySkeleton width={pTd(20)} height={pTd(22)} />
                <PortkeySkeleton width={pTd(280)} height={pTd(22)} style={[GStyles.marginLeft(pTd(12))]} />
              </View>
              <PortkeySkeleton
                width={pTd(208)}
                height={pTd(20)}
                style={[GStyles.marginTop(pTd(4)), GStyles.marginLeft(pTd(32))]}
              />
            </>
          ) : (
            <>
              <View style={styles.cardPart1}>
                <Svg icon="gift" size={pTd(24)} />
                <TextL style={[styles.text, GStyles.lineHeight(pTd(23)), fonts.SGRegularFont]} numberOfLines={1}>
                  {redPacketDetail?.memo || 'Best Wishes'}
                </TextL>
                {redPacketDetail?.displayStatus && (
                  <View style={[styles.statusContainer, statusStyles.bg]}>
                    <TextS style={[styles.statusText, statusStyles.textColor, GStyles.lineHeight(pTd(12))]}>
                      {redPacketDetail?.displayStatus}
                    </TextS>
                  </View>
                )}
                <Svg icon="chevron_right" size={pTd(12)} iconStyle={GStyles.marginLeft(12)} />
              </View>
              {/* <Text style={styles.dateText}>May 28 at 4:11 pm</Text> */}
              <View style={styles.dateContainer}>
                <TextM style={[styles.dateText, GStyles.lineHeight(pTd(20))]}>
                  {formatTransferTime(redPacketDetail?.createTime || 1)}
                </TextM>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
const getStyles = makeStyles(theme => ({
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
    height: pTd(70),
    // borderWidth: pTd(1),
    // borderColor: defaultColors.neutralBorder,
    borderRadius: pTd(6),
    // paddingHorizontal: pTd(16),
    paddingVertical: pTd(12),
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
    marginLeft: pTd(12),
  },
  statusContainer: {
    paddingLeft: pTd(6),
    paddingRight: pTd(6),
    paddingTop: pTd(4),
    paddingBottom: pTd(4),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(4),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  statusText: {
    textAlign: 'right',
    color: theme.colors.textDisabled2,
  },

  dateContainer: {
    paddingLeft: pTd(32),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pTd(2),
  },
  dateText: {
    color: theme.colors.textBase2,
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
}));
