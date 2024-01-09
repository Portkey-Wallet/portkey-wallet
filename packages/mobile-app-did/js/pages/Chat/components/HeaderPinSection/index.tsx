import React, { useMemo } from 'react';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { Image, StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { showPinnedListOverlay } from '../PinnedListOverlay';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import { ParsedImage } from '@portkey-wallet/im';
import fonts from 'assets/theme/fonts';
import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';

export type HeaderPinSection = {
  channelUUid: string;
};

export default function HeaderPinSection(props: HeaderPinSection) {
  const { channelUUid = '' } = props;

  const { isAdmin } = useGroupChannelInfo(channelUUid || '');
  const { list, lastPinMessage } = useIMPin(channelUUid, true);

  const isImg = useMemo(() => lastPinMessage?.type === 'IMAGE', [lastPinMessage]);

  const url = useMemo(
    () => decodeURIComponent((lastPinMessage?.parsedContent as ParsedImage).thumbImgUrl || ''),
    [lastPinMessage?.parsedContent],
  );

  if (!lastPinMessage) return null;

  return (
    <Touchable
      style={[GStyles.flexRow, GStyles.itemCenter, styles.wrap]}
      onPress={() => showPinnedListOverlay(isAdmin)}>
      <View style={styles.leftBlue} />
      {isImg && <Image style={styles.img} resizeMode="cover" source={{ uri: url }} />}
      <View style={GStyles.flex1}>
        <TextM numberOfLines={1} style={[fonts.mediumFont, FontStyles.font4, styles.title]}>
          {`Pinned Message ${list.length}`}
        </TextM>
        <TextM numberOfLines={1} style={[FontStyles.font5, styles.content]}>
          {isImg ? 'Photo' : lastPinMessage?.content}
        </TextM>
      </View>
      <Svg icon="pin-list-icon" size={pTd(20)} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 100,
    paddingLeft: pTd(12),
    paddingRight: pTd(16),
    paddingVertical: pTd(8),
    backgroundColor: defaultColors.bg1,
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: defaultColors.shadow1,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  leftBlue: {
    width: pTd(3),
    height: pTd(40),
    backgroundColor: defaultColors.primaryColor,
    marginRight: pTd(8),
  },
  img: {
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(4),
    marginRight: pTd(8),
  },
  title: {
    lineHeight: pTd(20),
    marginRight: pTd(8),
  },
  content: {
    marginRight: pTd(8),
    lineHeight: pTd(20),
  },
});
