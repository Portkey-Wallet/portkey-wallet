import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from 'components/CommonTopTab';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { useAccountNFTCollectionInfo, useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import Svg from 'components/Svg';
import { View } from 'react-native';
import Touchable from 'components/Touchable';
import ModeChangeSelector from '../componets/ModeChangeSelector';
import { useNFTSection } from '@portkey-wallet/hooks/hooks-ca';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';

const DashBoardTab: React.FC = () => {
  const { t } = useLanguage();
  const { totalRecordCount } = useAccountNFTCollectionInfo();
  const { totalDisplayCount } = useAccountTokenInfo();
  const { nftSectionUiType, changeNFTSectionMode } = useNFTSection();
  const styles = getStyles();

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <TokenSection />,
        suffix: (totalDisplayCount || 0) + '',
      },
      {
        name: t('NFTs'),
        tabItemDom: <NFTSection />,
        suffix: (totalRecordCount || 0) + '',
      },
    ];
  }, [t, totalDisplayCount, totalRecordCount]);
  const modeList = useMemo(() => {
    return [
      {
        name: 'Collections',
        icon: 'grid',
        key: 'Collections',
      },
      {
        name: 'NFTs',
        icon: 'rows',
        key: 'NFTs',
      },
    ];
  }, []);
  const suffixIconDom = useMemo(() => {
    return (
      <View style={[styles.suffixDomWrapper, { marginLeft: totalRecordCount !== 0 ? pTd(130) : pTd(168) }]}>
        {/* <View style={[GStyles.flex1, { backgroundColor: 'red'}]} /> */}
        <Touchable
          onPress={() => {
            ModeChangeSelector.showList({
              list: modeList,
              selectedIndex: nftSectionUiType,
              onSelected: (item, key) => {
                changeNFTSectionMode(key as 'Collections' | 'NFTs');
              },
            });
          }}>
          {totalRecordCount !== 0 && (
            <Svg
              icon={nftSectionUiType === 'Collections' ? 'grid' : 'rows'}
              size={pTd(22)}
              iconStyle={{ marginRight: pTd(16) }}
            />
          )}
        </Touchable>
        <Touchable
          onPress={() => {
            navigationService.navigate('FreeMintHome');
          }}>
          <Svg icon="free-mint-entry" size={pTd(22)} />
        </Touchable>
      </View>
    );
  }, [changeNFTSectionMode, modeList, nftSectionUiType, styles.suffixDomWrapper, totalRecordCount]);
  return (
    <CommonTopTab
      swipeEnabled
      hasTabBarBorderRadius={false}
      hasBottomBorder={false}
      tabList={tabList}
      tabContainerStyle={styles.tabContainerStyle}
      suffixIconDom={suffixIconDom}
    />
  );
};

export const getStyles = makeStyles(theme => ({
  tabContainerStyle: {
    backgroundColor: theme.colors.bgBase2,
    borderTopLeftRadius: pTd(16),
    borderTopRightRadius: pTd(16),
  },
  suffixDomWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginLeft: pTd(130),
  },
}));

export default DashBoardTab;
