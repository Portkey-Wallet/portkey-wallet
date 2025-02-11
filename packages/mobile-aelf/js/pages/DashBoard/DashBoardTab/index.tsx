import React, { useMemo, useState } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from 'components/CommonTopTab';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { useAccountNFTCollectionInfo, useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-eoa/assets';
import Svg from 'components/Svg';
import { View } from 'react-native';
import Touchable from 'components/Touchable';
import ModeChangeSelector from '../componets/ModeChangeSelector';
import { useNFTSection } from '@portkey-wallet/hooks/hooks-eoa';
// import navigationService from 'utils/navigationService';
import GStyles from 'assets/theme/GStyles';

enum TabName {
  Tokens = 'Tokens',
  NFTs = 'NFTs',
}

const DashBoardTab: React.FC = () => {
  const { t } = useLanguage();
  const { totalNftItemCount } = useAccountNFTCollectionInfo();
  const { totalDisplayCount } = useAccountTokenInfo();
  const { nftSectionUiType, changeNFTSectionMode } = useNFTSection();
  const styles = getStyles();
  const [suffixIconDomVisible, setSuffixIconDomVisible] = useState<boolean>();

  const tabNameMap = useMemo(() => {
    return {
      [TabName.Tokens]: t(TabName.Tokens),
      [TabName.NFTs]: t(TabName.NFTs),
    };
  }, [t]);

  const tabList = useMemo(() => {
    return [
      {
        name: tabNameMap[TabName.Tokens],
        tabItemDom: <TokenSection />,
        suffix: (totalDisplayCount || 0) + '',
      },
      {
        name: tabNameMap[TabName.NFTs],
        tabItemDom: <NFTSection />,
        suffix: (totalNftItemCount || 0) + '',
      },
    ];
  }, [tabNameMap, totalDisplayCount, totalNftItemCount]);
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
    if (totalNftItemCount === 0) {
      return null;
    }
    return (
      <View style={[styles.suffixDomWrapper]}>
        {/* <View style={[GStyles.flex1, { backgroundColor: 'red'}]} /> */}
        <Touchable
          onPress={() => {
            ModeChangeSelector.showList({
              list: modeList,
              selectedIndex: nftSectionUiType,
              topWrapStyle: GStyles.paddingTop(0),
              onSelected: (item, key) => {
                changeNFTSectionMode(key as 'Collections' | 'NFTs');
              },
            });
          }}>
          {totalNftItemCount !== 0 && (
            <Svg
              icon={nftSectionUiType === 'Collections' ? 'grid' : 'rows'}
              size={pTd(22)}
              iconStyle={{ marginRight: pTd(16) }}
            />
          )}
        </Touchable>
        {/* <Touchable
          onPress={() => {
            navigationService.navigate('FreeMintHome');
          }}>
          <Svg icon="free-mint-entry" size={pTd(22)} />
        </Touchable> */}
      </View>
    );
  }, [changeNFTSectionMode, modeList, nftSectionUiType, styles.suffixDomWrapper, totalNftItemCount]);
  return (
    <CommonTopTab
      swipeEnabled
      hasTabBarBorderRadius={false}
      hasBottomBorder={false}
      tabList={tabList}
      tabContainerStyle={styles.tabContainerStyle}
      suffixIconDom={suffixIconDom}
      suffixIconDomVisible={suffixIconDomVisible}
      onTabChange={name => {
        if (name === t('Tokens')) {
          setSuffixIconDomVisible(false);
        } else {
          setSuffixIconDomVisible(true);
        }
      }}
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
    marginLeft: pTd(165),
  },
}));

export default DashBoardTab;
