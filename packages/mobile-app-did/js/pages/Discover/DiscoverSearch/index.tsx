import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonInput from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { useFocusEffect } from '@react-navigation/native';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import RecordSection from '../components/RecordSection';
import SearchDiscoverSection from '../components/SearchDiscoverSection';
import { isIOS } from '@rneui/base';
import { checkIsUrl, getHost, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';

export default function DiscoverSearch() {
  const { t } = useLanguage();

  const discoverGroupList = useDiscoverGroupList();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const iptRef = useRef<any>();
  const [value, setValue] = useState<string>('');
  const [showRecord, setShowRecord] = useState<boolean>(true);
  const [filteredDiscoverList, setFilteredDiscoverList] = useState<DiscoverItem[]>([]);

  const navBack = useCallback(() => {
    navigationService.goBack();
  }, []);

  const flatList = useMemo((): DiscoverItem[] => {
    const list = [] as DiscoverItem[];
    discoverGroupList.map(group => {
      group?.items?.map(item => {
        list.push(item);
      });
    });

    return list;
  }, [discoverGroupList]);

  const clearText = useCallback(() => setValue(''), []);

  useEffect(() => {
    if (!value) setShowRecord(true);
  }, [value]);

  const onSearch = useCallback(() => {
    const newValue = value.replace(/\s+/g, '');
    if (!newValue) return;

    if (checkIsUrl(newValue)) {
      jumpToWebview({
        item: {
          id: Date.now(),
          name: getHost(prefixUrlWithProtocol(newValue)),
          url: prefixUrlWithProtocol(newValue),
        },
      });
    } else {
      // else search in Discover list
      const filterList = flatList.filter(item => item.title.replace(/\s+/g, '').includes(newValue));
      setFilteredDiscoverList(filterList);
      setShowRecord(false);
    }
  }, [flatList, jumpToWebview, value]);

  useFocusEffect(
    useCallback(() => {
      if (iptRef?.current && !isIOS) {
        timerRef.current = setTimeout(() => {
          iptRef.current.focus();
        }, 300);
      }
    }, []),
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg5, GStyles.flexRow, styles.inputContainer]}>
        <CommonInput
          autoFocus
          ref={iptRef}
          value={value}
          onChangeText={v => setValue(v)}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          placeholder={t('Search Dapp or enter URL')}
          containerStyle={styles.inputStyle}
          rightIcon={
            value ? (
              <TouchableOpacity onPress={clearText}>
                <Svg icon="clear3" size={pTd(16)} />
              </TouchableOpacity>
            ) : undefined
          }
          rightIconContainerStyle={styles.rightIconContainerStyle}
          style={styles.rnInputStyle}
        />
        <TouchableOpacity onPress={navBack}>
          <TextM style={[FontStyles.font2, styles.cancelButton]}>{t('Cancel')}</TextM>
        </TouchableOpacity>
      </View>
      {showRecord ? <RecordSection /> : <SearchDiscoverSection searchedDiscoverList={filteredDiscoverList || []} />}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
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
