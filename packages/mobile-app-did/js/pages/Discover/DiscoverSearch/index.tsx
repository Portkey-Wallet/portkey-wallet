import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import CommonInput from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import RecordSection from '../components/SearchRecordSection';
import SearchDiscoverSection from '../components/SearchDiscoverSection';
import { checkIsUrl, getHost, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useInputFocus } from 'hooks/useInputFocus';
import Touchable from 'components/Touchable';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';

export default function DiscoverSearch() {
  const { t } = useLanguage();
  const { learnGroupList, earnList } = useDiscoverData();

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);

  const discoverGroupList = useDiscoverGroupList();
  const jumpToWebview = useDiscoverJumpWithNetWork();
  const [value, setValue] = useState<string>('');
  const [showRecord, setShowRecord] = useState<boolean>(true);
  const [filteredDiscoverList, setFilteredDiscoverList] = useState<DiscoverItem[]>([]);

  const clearText = useCallback(() => setValue(''), []);

  const flatList = useMemo((): DiscoverItem[] => {
    const list = [] as DiscoverItem[];
    discoverGroupList.map(group => {
      group?.items?.map(item => {
        list.push(item);
      });
    });
    learnGroupList.map(group => {
      group?.items?.map(item => {
        list.push(parseLearnItemToDiscoverItem(item));
      });
    });

    earnList.map(ele => {
      list.push(parseLearnItemToDiscoverItem(ele));
    });

    return list;
  }, [discoverGroupList, earnList, learnGroupList]);

  useEffect(() => {
    if (!value) setShowRecord(true);
  }, [value]);

  const onDiscoverJump = useCallback(
    (name: string, url: string) => {
      jumpToWebview({
        item: {
          name,
          url,
        },
      });
    },
    [jumpToWebview],
  );

  const onSearch = useCallback(() => {
    const newValue = value.replace(/\s+/g, '');
    if (!newValue) return;

    console.log('checkIsUrl', checkIsUrl(newValue));

    if (checkIsUrl(newValue)) {
      console.log('checkIsUrl', getHost(prefixUrlWithProtocol(newValue)));

      onDiscoverJump(getHost(prefixUrlWithProtocol(newValue)), prefixUrlWithProtocol(newValue));
    } else {
      // else search in Discover list
      const filterList = flatList.filter(item =>
        item.title.replace(/\s+/g, '').toLocaleLowerCase().includes(newValue.toLocaleLowerCase()),
      );
      setFilteredDiscoverList(filterList);
      setShowRecord(false);
    }
  }, [flatList, onDiscoverJump, value]);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['white', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg1, GStyles.flexRow, styles.inputContainer]}>
        <CommonInput
          autoFocus
          grayBorder
          theme="white-bg"
          ref={iptRef}
          value={value}
          onChangeText={v => setValue(v)}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          placeholder={t('Search Dapp or enter URL')}
          containerStyle={styles.inputStyle}
          rightIcon={
            value ? (
              <Touchable onPress={clearText}>
                <Svg icon="clear3" size={pTd(16)} />
              </Touchable>
            ) : undefined
          }
          rightIconContainerStyle={styles.rightIconContainerStyle}
          style={styles.rnInputStyle}
        />
        <Touchable onPress={navigationService.goBack}>
          <TextM style={[FontStyles.primaryColor, styles.cancelButton]}>{t('Cancel')}</TextM>
        </Touchable>
      </View>
      {showRecord ? <RecordSection /> : <SearchDiscoverSection searchedDiscoverList={filteredDiscoverList || []} />}
    </PageContainer>
  );
}

const parseLearnItemToDiscoverItem = (item: TBaseCardItemType): DiscoverItem => {
  return {
    title: item.title || '',
    description: item.description || '',
    url: item.url,
    imgUrl: item.imgUrl,
    id: '-1',
    index: Number(item.index),
  };
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(12, 20, 8),
  },
  inputStyle: {
    width: pTd(280),
  },
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  rnInputStyle: {
    fontSize: pTd(14),
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
});
