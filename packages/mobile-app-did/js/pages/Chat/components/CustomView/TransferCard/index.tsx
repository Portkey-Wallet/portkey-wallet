import React, { memo, useCallback, useMemo } from 'react';
import { MessageProps } from 'react-native-gifted-chat';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import { TextS, TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
import { ParsedTransfer } from '@portkey-wallet/im';
import navigationService from 'utils/navigationService';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ActivityTypeEnum } from '@portkey-wallet/store/store-ca/activity/type';

function TransferCard(props: MessageProps<ChatMessage>) {
  const { userId } = useCurrentUserInfo() || {};

  const { currentMessage } = props;
  const { parsedContent } = currentMessage || {};

  const transferInfo = useMemo<ParsedTransfer>(() => parsedContent as ParsedTransfer, [parsedContent]);

  const isReceived = useMemo(() => transferInfo?.data?.toUserId === userId, [transferInfo?.data?.toUserId, userId]);

  const onPress = useCallback(() => {
    navigationService.navigate('ActivityDetail', {
      transactionId: transferInfo.data?.transactionId,
      blockHash: transferInfo.data?.blockHash,
      activityType: ActivityTypeEnum.TRANSFER_CARD,
    });
  }, [transferInfo.data?.blockHash, transferInfo.data?.transactionId]);

  const transferInfoShow = useMemo(() => {
    if (!transferInfo?.transferExtraData) return ' - ';

    if (transferInfo.transferExtraData?.tokenInfo) {
      return `${divDecimalsToShow(
        transferInfo?.transferExtraData?.tokenInfo?.amount || '',
        transferInfo?.transferExtraData?.tokenInfo?.decimal,
      )} ${transferInfo?.transferExtraData?.tokenInfo?.symbol}`;
    } else {
      return `${transferInfo?.transferExtraData?.nftInfo?.alias} #${transferInfo?.transferExtraData?.nftInfo?.nftId}`;
    }
  }, [transferInfo.transferExtraData]);

  return (
    <Touchable highlight underlayColor={defaultColors.bg24} style={styles.wrap} onPress={onPress}>
      <View style={[GStyles.flexRow, GStyles.itemCenter]}>
        <Svg icon="transfer-preview" size={pTd(40)} />
        <View style={styles.rightSection}>
          <TextL numberOfLines={1} style={[fonts.mediumFont, styles.memo]}>
            {transferInfoShow}
          </TextL>
          <TextS style={styles.blank} />
          <TextS style={styles.state} numberOfLines={1}>{`${isReceived ? 'Received from' : 'Transfer to'} ${
            isReceived ? transferInfo?.data?.senderName || '' : transferInfo?.data?.toUserName || ''
          }`}</TextS>
        </View>
      </View>
    </Touchable>
  );
}

export default memo(TransferCard, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  wrap: {
    width: pTd(260),
    height: pTd(72),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(16),
    backgroundColor: defaultColors.bg22,
    borderRadius: pTd(12),
    overflow: 'hidden',
  },
  rightSection: {
    marginLeft: pTd(12),
    width: pTd(180),
  },
  memo: {
    color: defaultColors.font2,
    lineHeight: pTd(22),
  },
  state: {
    color: defaultColors.font2,
    lineHeight: pTd(16),
    opacity: 0.8,
  },
  blank: {
    height: pTd(2),
  },
});
