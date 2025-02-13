import { IconName } from 'components/Svg';
import { ChainId } from '@portkey-wallet/types';
import React, { useCallback } from 'react';
import ActionSheet from 'components/ActionSheet';
import { Text, View } from 'react-native';
import CommonAvatar from 'components/CommonAvatar';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import * as Clipboard from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { makeStyles } from '@rneui/themed';
import fonts from '../assets/theme/fonts';

const modalAddressInfo: {
  chain: ChainId;
  name: string;
  icon: IconName;
  addressFormatted: string;
  addressShow: string;
}[] = [
  {
    chain: 'tDVV',
    icon: 'Chain=AELF Side',
    name: 'aelf dAppChain',
    addressFormatted: '',
    addressShow: '',
  },
  {
    chain: 'AELF',
    icon: 'Chain=AELF Main',
    name: 'aelf MainChain',
    addressFormatted: '',
    addressShow: '',
  },
];

export const useMultiChainAddressesModal = () => {
  const addressCardStyles = getAddressCardStyles();

  const showMultiChainAddressesModal = useCallback(
    ({ address }: { address: string }) => {
      const addressesShowInfo = modalAddressInfo.map(_addressInfo => {
        const addressFormatted = addressFormat(address, _addressInfo.chain);
        return {
          ..._addressInfo,
          addressFormatted,
          addressShow: formatStr2EllipsisStr(addressFormatted, 8),
        };
      });
      ActionSheet.alert({
        isCloseShow: false,
        title: (
          <View>
            <Text style={addressCardStyles.header}>Multichain addresses</Text>
            <View style={addressCardStyles.cardContainer}>
              {addressesShowInfo.map((addressShowInfo, addressesShowInfoIndex) => {
                return (
                  <View style={addressCardStyles.card} key={addressesShowInfoIndex}>
                    <View style={addressCardStyles.info}>
                      <CommonAvatar
                        hasBorder={false}
                        style={addressCardStyles.chainIcon}
                        svgName={addressShowInfo.icon}
                        avatarSize={pTd(24)}
                        height={pTd(24)}
                        width={pTd(24)}
                      />
                      <View>
                        <Text style={addressCardStyles.title}>{addressShowInfo.name}</Text>
                        <Text style={addressCardStyles.subtitle}>{addressShowInfo.addressShow}</Text>
                      </View>
                    </View>
                    <Touchable
                      onPress={async () => {
                        const isCopy = await Clipboard.setStringAsync(addressShowInfo.addressFormatted);
                        if (isCopy) {
                          CommonToast.success('Copied');
                        }
                      }}>
                      <CommonAvatar
                        hasBorder={false}
                        style={addressCardStyles.icon}
                        svgName="copy_v2"
                        avatarSize={pTd(24)}
                        height={pTd(24)}
                        width={pTd(24)}
                      />
                    </Touchable>
                  </View>
                );
              })}
            </View>
          </View>
        ),
        buttonGroupDirection: 'column',
        buttons: [],
      });
    },
    [
      addressCardStyles.card,
      addressCardStyles.cardContainer,
      addressCardStyles.chainIcon,
      addressCardStyles.header,
      addressCardStyles.icon,
      addressCardStyles.info,
      addressCardStyles.subtitle,
      addressCardStyles.title,
    ],
  );

  return {
    showMultiChainAddressesModal,
  };
};

const getAddressCardStyles = makeStyles(theme => ({
  header: {
    ...fonts.BGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(20),
    lineHeight: pTd(16) * 1.2,
  },
  cardContainer: {
    flexDirection: 'column',
  },
  card: {
    flexDirection: 'row',
    paddingVertical: pTd(16),
    // paddingHorizontal: pTd(12),
    justifyContent: 'space-between',
    width: '100%',
    marginTop: pTd(12),
  },
  info: {
    flexDirection: 'row',
  },
  chainIcon: {
    marginRight: pTd(12),
  },
  title: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    // marginTop: pTd(8),
  },
  subtitle: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginTop: pTd(5),
    width: pTd(250),
  },
  icon: {
    backgroundColor: 'transparent',
  },
}));
