import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View, Button, Image } from 'react-native';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca/index';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Card from './components/card';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import BrowserTab from 'components/BrowserTab';
import { showBrowserModal } from './components/tabsOverlay';

const TabsDrawerContent: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const { activeTabId, tabs } = useAppCASelector(state => state.discover);

  console.log('tabs', tabs);

  const rightDom = useMemo(() => {
    const activeItem = tabs.find(ele => ele.id === activeTabId);

    console.log('activeItem', activeItem);

    if (activeTabId)
      return (
        <View style={rightDomStyle.iconGroupWrap}>
          <TouchableOpacity style={rightDomStyle.iconWrap}>
            <Svg icon="wallet-white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              showBrowserModal({
                browserInfo: { title: activeItem?.name ?? '', url: activeItem?.url },
                setBrowserInfo: undefined,
                handleReload: undefined,
              })
            }
            style={rightDomStyle.iconWrap}>
            <Svg icon="more" size={20} />
          </TouchableOpacity>
        </View>
      );
    return null;
  }, [activeTabId, tabs]);

  return (
    <PageContainer
      hideTouchable
      leftDom={!activeTabId && <View />}
      leftCallback={() => dispatch(changeDrawerOpenStatus(false))}
      rightDom={rightDom}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}
      titleDom={activeTabId ? '' : `${tabs?.length} Tabs`}>
      {tabs?.map(ele => (
        <BrowserTab key={ele.id} isHidden={activeTabId !== ele.id} uri={ele.url} />
      ))}

      {!activeTabId && (
        <>
          <ScrollView>
            <View style={styles.cardsContainer}>
              {tabs.map(ele => {
                return <Card key={ele.id} item={ele} />;
              })}
            </View>
          </ScrollView>
          <View style={handleButtonStyle.container}>
            <TextM style={FontStyles.font4}>{t('Close All')}</TextM>
            <TouchableOpacity onPress={() => dispatch(changeDrawerOpenStatus(false))}>
              <Svg icon="add-blue" size={pTd(28)} />
            </TouchableOpacity>
            <TextM style={FontStyles.font4} onPress={() => console.log('done')}>
              {t('Done')}
            </TextM>
          </View>
        </>
      )}
    </PageContainer>
  );
};

export default TabsDrawerContent;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    backgroundColor: defaultColors.bg6,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  inputStyle: {
    width: pTd(280),
  },
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  cardsContainer: {
    scrollEnabled: true,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
});

const handleButtonStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    height: pTd(44),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    position: 'absolute',
    bottom: 0,
    backgroundColor: defaultColors.bg1,
  },
  handleItem: {
    flex: 1,
  },
});

const rightDomStyle = StyleSheet.create({
  iconGroupWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    ...GStyles.paddingArg(pTd(4)),
    marginRight: pTd(16),
  },
});
