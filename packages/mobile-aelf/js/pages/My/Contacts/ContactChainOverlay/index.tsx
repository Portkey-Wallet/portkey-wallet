import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, Image } from 'react-native';
import Touchable from 'components/Touchable';
import getStyles from './styles';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';

import { useGStyles } from 'assets/theme/useGStyles';
import { ModalBody } from 'components/ModalBody';
import { INetworkItemType } from '@portkey-wallet/types/types-eoa/contact';

interface ISelectListProps {
  list: INetworkItemType[];
  value?: INetworkItemType;
  onChange: (item: INetworkItemType) => void;
}

const SelectList = ({ list, value, onChange }: ISelectListProps) => {
  const gStyle = useGStyles();
  const styles = getStyles();

  return (
    <ModalBody style={gStyle.overlayStyle} title={'Select Network'} modalBodyType="bottom">
      {list.length ? (
        <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
          {list.map((item, index) => {
            return (
              <Touchable
                key={item.chainId}
                onPress={() => {
                  OverlayModal.hide();
                  if (value === item) {
                    return;
                  }
                  onChange(item);
                }}>
                <View style={[styles.itemRow, index > 0 && { marginTop: pTd(12) }]}>
                  <Image style={styles.networkImage} source={{ uri: item?.imageUrl || '' }} />
                  <View style={styles.itemContent}>
                    <TextL>{item.name}</TextL>
                  </View>
                  {value?.chainId === item.chainId && value?.network === item.network && (
                    <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                  )}
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
      ) : (
        <TextL style={styles.noResult}>{'No results found'}</TextL>
      )}
    </ModalBody>
  );
};

const showList = (params: ISelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};
