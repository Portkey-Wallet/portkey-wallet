import React from 'react';
import OverlayModal from '../OverlayModal';
import Touchable from '../Touchable';
import Svg from '../Svg';
import { TextL, TextS } from '../CommonText';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { DepositItem } from '@portkey-wallet/rn-base/hooks/deposit';
import { FontStyles } from '../../theme/styles';
import { makeStyles } from '../../theme';
export type DepositListProps = {
  list: DepositItem[];
};

function Item({ item }: { item: DepositItem }) {
  const styles = useStyles();
  return (
    <Touchable
      style={styles.itemRow}
      onPress={() => {
        OverlayModal.hide(false);
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

export const useStyles = makeStyles(theme => {
  return {
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
      borderColor: theme.border6,
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
  };
});
