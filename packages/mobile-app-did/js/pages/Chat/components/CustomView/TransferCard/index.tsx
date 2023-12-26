import React, { memo, useCallback, useMemo } from 'react';
import { MessageProps } from 'react-native-gifted-chat';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import { TextXL, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { ParsedTransfer } from '@portkey-wallet/im';
import navigationService from 'utils/navigationService';
import { useUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetContactLabel } from '@portkey-wallet/hooks/hooks-ca/contact';

function TransferCard(props: MessageProps<ChatMessage>) {
  const { userId } = useUserInfo() || {};
  const getContactLabel = useGetContactLabel();

  const { currentMessage } = props;
  const { parsedContent } = currentMessage || {};

  const transferInfo = useMemo<ParsedTransfer>(() => parsedContent as ParsedTransfer, [parsedContent]);

  const isReceived = useMemo(() => transferInfo?.data?.toUserId === userId, [transferInfo?.data?.toUserId, userId]);

  const onPress = useCallback(() => {
    navigationService.navigate('ActivityDetail', {
      transactionId: transferInfo.data?.transactionId,
      blockHash: transferInfo.data?.blockHash,
    });
  }, [transferInfo.data?.blockHash, transferInfo.data?.transactionId]);

  const transferInfoShow = useMemo(() => {
    if (transferInfo.transferExtraData?.tokenInfo) {
      return `${formatAmountShow(
        divDecimals(
          transferInfo?.transferExtraData?.tokenInfo?.amount || '',
          transferInfo?.transferExtraData?.tokenInfo?.decimal,
        ),
        transferInfo?.transferExtraData?.tokenInfo?.decimal,
      )} ${transferInfo?.transferExtraData?.tokenInfo?.symbol}`;
    } else {
      return `${transferInfo?.transferExtraData?.nftInfo?.alias} #${transferInfo?.transferExtraData?.nftInfo?.nftId}`;
    }
  }, [
    transferInfo.transferExtraData?.nftInfo?.alias,
    transferInfo.transferExtraData?.nftInfo?.nftId,
    transferInfo.transferExtraData?.tokenInfo,
  ]);

  return (
    <Touchable underlayColor={defaultColors.bg24} style={styles.wrap} onPress={onPress}>
      <View style={[GStyles.flexRow, GStyles.itemCenter]}>
        <Svg icon="transfer-preview" size={pTd(40)} />
        <View style={styles.rightSection}>
          <TextXL numberOfLines={1} style={[fonts.mediumFont, styles.memo]}>
            {transferInfoShow}
          </TextXL>
          <TextS style={styles.blank} />
          <TextS style={styles.state} numberOfLines={1}>{`${isReceived ? 'Received from' : 'Transfer to'} ${
            isReceived
              ? getContactLabel(transferInfo?.data?.senderId, transferInfo?.data?.senderName)
              : getContactLabel(transferInfo?.data?.toUserId, transferInfo?.data?.toUserName)
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
