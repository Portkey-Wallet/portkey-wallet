import React, { useCallback, useMemo } from 'react';
import { useLanguage } from 'i18n/hooks';
import { makeStyles } from '@rneui/themed';
import { useTheme } from '@rneui/themed';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { View, FlatList, Text } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

interface IAddress {
  avatar?: string;
  nickName?: string;
  address: string;
  chain?: string;
}

interface ISelectAddressTabProps {
  recentAddressList: IAddress[];
  savedAddressList: IAddress[];
  myAddressList: IAddress[];
  noDataMessage: string;
}

const AddressList = ({ addressList }: { addressList: IAddress[] }) => {
  const styles = getStyles();
  const {
    theme: { colors },
  } = useTheme();

  const renderItem = useCallback(
    ({ item, index }: { item: IAddress; index: number }) => {
      const address = formatStr2EllipsisStr(item.address);
      const textAbove = item.nickName ? item.nickName : address;
      const textBelow = item.nickName ? address : item.chain;
      return (
        <Touchable style={[styles.addressRow, index !== 0 && styles.addressRowMT]}>
          <CommonAvatar
            style={styles.avatar}
            color={colors.textBrand4}
            title={item.nickName || address}
            avatarSize={pTd(40)}
            imageUrl={item.avatar}
          />
          <View style={styles.infoWrap}>
            <View>
              <Text style={styles.textAbove} numberOfLines={1} ellipsizeMode={'tail'}>
                {textAbove}
              </Text>
              {textBelow && (
                <Text style={styles.textBelow} numberOfLines={1} ellipsizeMode={'tail'}>
                  {textBelow}
                </Text>
              )}
            </View>
          </View>
          <Svg iconStyle={styles.infoIcon} icon="info" color={colors.iconBase1} size={pTd(24)} />
        </Touchable>
      );
    },
    [colors, styles],
  );

  return (
    <View style={styles.addressListWrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        data={addressList || []}
        renderItem={renderItem}
        keyExtractor={item => item.address}
      />
    </View>
  );
};

const SelectAddressTab: React.FC<ISelectAddressTabProps> = (props: ISelectAddressTabProps) => {
  const { t } = useLanguage();
  const { recentAddressList, savedAddressList, myAddressList } = props;

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recent'),
        tabItemDom: <AddressList addressList={recentAddressList} />,
      },
      {
        name: t('Saved'),
        tabItemDom: <AddressList addressList={savedAddressList} />,
      },
      {
        name: t('My addresses'),
        tabItemDom: <AddressList addressList={myAddressList} />,
      },
    ];
  }, [t, recentAddressList, savedAddressList, myAddressList]);

  return <CommonTopTab swipeEnabled hasTabBarBorderRadius={false} hasBottomBorder={false} tabList={tabList} />;
};

export default SelectAddressTab;

const getStyles = makeStyles(theme => ({
  addressListWrap: {
    flex: 1,
    paddingVertical: pTd(8),
    backgroundColor: theme.colors.bgBase1,
  },
  addressRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: pTd(16),
  },
  addressRowMT: {
    marginTop: pTd(16),
  },
  avatar: {
    width: pTd(40),
    height: pTd(40),
    backgroundColor: theme.colors.bgBrand1,
  },
  infoWrap: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: pTd(12),
  },
  textAbove: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  textBelow: {
    marginTop: pTd(2),
    ...fonts.SGRegularFont,
    color: theme.colors.textBase3,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  infoIcon: {
    marginLeft: pTd(12),
  },
}));
