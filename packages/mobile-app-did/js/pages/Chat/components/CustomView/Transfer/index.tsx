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
import Loading from 'components/Loading';
import ViewPacketOverlay from '../../ViewPacketOverlay';
import navigationService from 'utils/navigationService';
import { RedPackageStatusEnum, RedPackageTypeEnum, redPackagesStatusShowMap } from '@portkey-wallet/im';
import CommonToast from 'components/CommonToast';
import {
  useGetCurrentRedPacketParsedData,
  useGetRedPackageDetail,
  useIsMyRedPacket,
} from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from 'pages/Chat/context/hooks';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import fonts from 'assets/theme/fonts';

function RedPacket(props: MessageProps<ChatMessage>) {
  const { currentMessage } = props;

  const currentChannelId = useCurrentChannelId();
  const { id: redPacketId, memo: redPacketMemo, senderId } = useGetCurrentRedPacketParsedData(currentMessage);
  const { initInfo } = useGetRedPackageDetail();
  const isMyPacket = useIsMyRedPacket(senderId);

  const isOpened = useMemo(
    () =>
      [RedPackageStatusEnum.OPENED, RedPackageStatusEnum.NONE_LEFT].includes(
        currentMessage?.redPackage?.viewStatus || RedPackageStatusEnum.UNOPENED,
      ),
    [currentMessage?.redPackage?.viewStatus],
  );
  const isFresh = useMemo(
    () => currentMessage?.redPackage?.viewStatus === RedPackageStatusEnum.UNOPENED,
    [currentMessage?.redPackage?.viewStatus],
  );

  const onPress = useCallback(async () => {
    Loading.show();

    try {
      const redPacketResult = await initInfo(currentChannelId || '', redPacketId);

      const isJumpToDetail =
        redPacketResult.isCurrentUserGrabbed || (redPacketResult.type === RedPackageTypeEnum.P2P && isMyPacket);

      if (isJumpToDetail) {
        navigationService.navigate('RedPacketDetails', {
          redPacketId,
          data: {
            info: redPacketResult,
          },
        });
      } else {
        ViewPacketOverlay.showViewPacketOverlay({ redPacketId, redPacketData: { ...redPacketResult, items: [] } });
      }
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [currentChannelId, initInfo, isMyPacket, redPacketId]);

  const redPacketStatus = useMemo(() => {
    return redPackagesStatusShowMap[currentMessage?.redPackage?.viewStatus || RedPackageStatusEnum.UNOPENED];
  }, [currentMessage?.redPackage?.viewStatus]);

  return (
    <Touchable
      highlight={isFresh}
      underlayColor={!isFresh ? undefined : defaultColors.bg24}
      style={styles.wrap}
      onPress={onPress}>
      <View style={[GStyles.flexRow, GStyles.itemCenter]}>
        <Svg icon="transfer-preview" size={pTd(40)} />
        <View style={styles.rightSection}>
          <TextXL numberOfLines={1} style={[fonts.mediumFont, styles.memo]}>
            1000000 ELF
          </TextXL>
          <TextS style={styles.state}>{formatChainInfoToShow('AELF')}</TextS>
          <TextS style={[GStyles.marginTop(4), styles.state]}>{redPacketStatus}</TextS>
        </View>
      </View>
    </Touchable>
  );
}

export default memo(RedPacket, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  wrap: {
    width: pTd(260),
    height: pTd(80),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(11),
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
});
