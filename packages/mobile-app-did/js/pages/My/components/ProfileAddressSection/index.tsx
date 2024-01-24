import { AELF_CHIAN_TYPE } from '@portkey-wallet/constants/constants-ca/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChainId, ChainType } from '@portkey-wallet/types';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { transNetworkTextWithAllChain } from '@portkey-wallet/utils/activity';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import FormItem from 'components/FormItem';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';

import React, { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { copyText } from 'utils';
import { pTd } from 'utils/unit';

type addressItemType = {
  address: string;
  chainId: ChainId;
  image?: string;
  chainName?: ChainType | string;
};

type ProfileAddressSectionPropsType = {
  title?: string;
  disable?: boolean;
  noMarginTop?: boolean;
  addressList?: addressItemType[];
  isMySelf?: boolean;
};

const ProfileAddressSection: React.FC<ProfileAddressSectionPropsType> = props => {
  const { title = 'Address', disable, noMarginTop, addressList: addressListProps, isMySelf } = props;
  const isMainnet = useIsMainnet();

  const copyId = useCallback(
    (ele: addressItemType) =>
      copyText(ele.chainName === AELF_CHIAN_TYPE || !ele.chainName ? `ELF_${ele.address}_${ele.chainId}` : ele.address),
    [],
  );

  const addressList = useMemo(() => {
    const _addressList = [...(addressListProps || [])];
    const index = _addressList.findIndex(ele => ele.chainId === 'AELF');
    if (index === -1) return _addressList;
    const aelfAddress = _addressList.splice(index, 1)[0];
    return [aelfAddress, ..._addressList];
  }, [addressListProps]);

  return (
    <FormItem title={title} style={!noMarginTop && GStyles.marginTop(pTd(24))}>
      {addressList?.map((ele, index) => (
        <View
          key={index}
          style={[disable ? BGStyles.bg18 : BGStyles.bg1, styles.itemWrap, index !== 0 && GStyles.marginTop(8)]}>
          <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween, styles.content]}>
            <TextM style={styles.address}>
              {formatStr2EllipsisStr(
                addressFormat(ele.address, ele.chainId, (ele?.chainName || 'aelf') as ChainType),
                20,
              )}
            </TextM>
            <Touchable onPress={() => copyId(ele)}>
              <Svg icon="copy" size={pTd(16)} />
            </Touchable>
          </View>
          <View style={GStyles.flexRow}>
            {isMySelf ? (
              <Svg icon={isMainnet ? 'mainnet' : 'testnet'} size={pTd(16)} />
            ) : (
              <Image
                source={{
                  uri: ele.image || '',
                }}
                style={styles.img}
              />
            )}
            <TextS style={[FontStyles.font3, GStyles.marginLeft(pTd(8))]}>
              {transNetworkTextWithAllChain(ele.chainId, !isMainnet, ele.chainName || 'aelf')}
            </TextS>
          </View>
        </View>
      ))}
    </FormItem>
  );
};

export default memo(ProfileAddressSection);

const styles = StyleSheet.create({
  itemWrap: {
    padding: pTd(16),
    borderRadius: pTd(6),
  },
  content: {
    marginBottom: pTd(8),
  },
  address: {
    width: pTd(270),
    color: defaultColors.font5,
  },
  img: {
    width: pTd(16),
    height: pTd(16),
    borderRadius: pTd(8),
  },
});
