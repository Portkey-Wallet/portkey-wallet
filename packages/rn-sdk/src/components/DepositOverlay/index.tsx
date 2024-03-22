import React from 'react';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { TextL, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { DepositItem } from 'hooks/deposit';
export type DepositListProps = {
  list: DepositItem[];
};

function Item({ item }: { item: DepositItem }) {
  return (
    <Touchable
      style={styles.itemRow}
      onPress={() => {
        OverlayModal.hide();
        item.onPress();
      }}>
      <Svg size={pTd(32)} icon={item.icon} />
      <View style={styles.textRow}>
        <TextL numberOfLines={1} style={styles.titleStyle}>
          {item.title}
        </TextL>
        <TextS style={[styles.descriptionStyle, FontStyles.font3]} numberOfLines={1}>
          {item.description}
        </TextS>
      </View>
    </Touchable>
  );
}

function DepositList({ list }: DepositListProps) {
  return (
    <View style={styles.wrapStyle}>
      {list.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </View>
  );
}

export const show = (props: DepositListProps) => {
  OverlayModal.show(<DepositList {...props} />, {
    position: 'bottom',
  });
};

export default {
  show,
};

export const styles = StyleSheet.create({
  wrapStyle: {
    width: screenWidth,
    paddingBottom: 16,
  },
  itemRow: {
    height: 80,
    marginHorizontal: pTd(20),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
  },
  textRow: {
    flex: 1,
    marginLeft: pTd(16),
  },
  titleStyle: {
    lineHeight: pTd(22),
  },
  descriptionStyle: {
    lineHeight: pTd(16),
  },
});
