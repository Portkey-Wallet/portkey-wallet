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
import im, { ParsedRedPackage, RedPackageStatusEnum, redPackagesStatusShowMap } from '@portkey-wallet/im';
import CommonToast from 'components/CommonToast';

function RedPacket(props: MessageProps<ChatMessage>) {
  const { currentMessage } = props;

  const isFresh = useMemo(
    () => currentMessage?.redPackage?.viewStatus === RedPackageStatusEnum.UNOPENED,
    [currentMessage?.redPackage?.viewStatus],
  );

  console.log('currentMessage', currentMessage);

  const onPress = useCallback(async () => {
    Loading.show();
    //TODO: get red packet states
    try {
      if (isFresh) {
        const { data } = await im.service.getRedPackageDetail({
          id: (currentMessage?.parsedContent as ParsedRedPackage)?.data?.id,
          skipCount: 0,
          maxResultCount: 10,
        });
        console.log('data', data);

        ViewPacketOverlay.showViewPacketOverlay({ data });
      } else {
        navigationService.navigate('RedPacketDetails');
      }
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [currentMessage?.parsedContent, isFresh]);

  const redPacketStatus = useMemo(() => {
    return redPackagesStatusShowMap[currentMessage?.redPackage?.viewStatus || RedPackageStatusEnum.UNOPENED];
  }, [currentMessage?.redPackage?.viewStatus]);

  return (
    <Touchable
      highlight={isFresh}
      underlayColor={!isFresh ? undefined : defaultColors.bg24}
      style={[styles.wrap, !isFresh && styles.opacityWrap]}
      onPress={onPress}>
      <View style={[GStyles.flexRow, GStyles.itemCenter]}>
        <Svg icon={isFresh ? 'red-packet' : 'red-packet-opened'} size={pTd(40)} />
        <View style={styles.rightSection}>
          <TextXL numberOfLines={1} style={styles.memo}>
            {(currentMessage?.parsedContent as ParsedRedPackage)?.data?.memo}
          </TextXL>
          <View style={styles.blank} />
          <TextS style={styles.state}>{redPacketStatus}</TextS>
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
    height: pTd(72),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(16),
    backgroundColor: defaultColors.bg22,
    borderRadius: pTd(12),
    overflow: 'hidden',
  },
  opacityWrap: {
    backgroundColor: defaultColors.bg23,
  },
  rightSection: {
    marginLeft: pTd(12),
    width: pTd(180),
  },
  blank: {
    height: pTd(2),
  },
  memo: {
    color: defaultColors.font2,
  },
  state: {
    color: defaultColors.font2,
  },
});
