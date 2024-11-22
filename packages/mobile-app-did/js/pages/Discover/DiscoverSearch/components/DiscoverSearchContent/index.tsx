import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import CommonInput from 'components/CommonInput';

import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import RecordSection from '../../../components/SearchRecordSection';
import SearchDiscoverSection from '../../../components/SearchDiscoverSection';
import { checkIsUrl, getHost, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useInputFocus } from 'hooks/useInputFocus';
import Touchable from 'components/Touchable';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import { makeStyles, useTheme } from '@rneui/themed';

export type TDiscoverSearchContentProps = {
  address?: string;
  onBack?: () => void;
  isInner?: boolean;
};
export default function DiscoverSearchContent({ address, onBack, isInner = false }: TDiscoverSearchContentProps) {
  const styles = getStyles();
  const { theme } = useTheme();

  const { t } = useLanguage();
  const { learnGroupList, earnList } = useDiscoverData();

  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);

  const discoverGroupList = useDiscoverGroupList();
  const jumpToWebview = useDiscoverJumpWithNetWork();
  const [value, setValue] = useState<string>('');
  const [showRecord, setShowRecord] = useState<boolean>(true);
  const [filteredDiscoverList, setFilteredDiscoverList] = useState<DiscoverItem[]>([]);

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
    if (!value) {
      setShowRecord(true);
    }
  }, [value]);

  useEffect(() => {
    if (address?.length) {
      setValue(address);
    }
  }, [address]);

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

  // const onSearchExternalLink = (link: string) => {
  //   onSearch();
  // }

  const onSearch = useCallback(
    (inputValue: string, isGo = false) => {
      const newValue = inputValue.replace(/\s+/g, '');
      if (!newValue) {
        return;
      }

      const isUrl = checkIsUrl(newValue);

      if (isGo) {
        if (isUrl) {
          onDiscoverJump(getHost(prefixUrlWithProtocol(newValue)), prefixUrlWithProtocol(newValue));
        } else {
          const _filterList = flatList.filter(item =>
            item.title.replace(/\s+/g, '').toLocaleLowerCase().includes(newValue.toLocaleLowerCase()),
          );
          if (_filterList.length) {
            const item = _filterList[0];
            onDiscoverJump(item.title, item.url);
          } else {
            onDiscoverJump(newValue, `https://www.google.com/search?q=${newValue}`);
          }
        }
        isInner && onBack?.();
        return;
      }

      if (!checkIsUrl(newValue)) {
        // search in Discover list
        const filterList = flatList.filter(item =>
          item.title.replace(/\s+/g, '').toLocaleLowerCase().includes(newValue.toLocaleLowerCase()),
        );
        setFilteredDiscoverList(filterList);
        setShowRecord(false);
        return;
      }
    },
    [flatList, isInner, onBack, onDiscoverJump],
  );

  const innerClick = useCallback(() => {
    isInner && onBack?.();
  }, [isInner, onBack]);

  return (
    <>
      <View style={styles.header}>
        <Touchable onPress={onBack}>
          <Svg icon={'left-arrow-v2'} size={pTd(20)} color={theme.colors.iconBase1} />
        </Touchable>
      </View>

      {showRecord ? (
        <RecordSection onClick={innerClick} />
      ) : (
        <SearchDiscoverSection
          searchedDiscoverList={filteredDiscoverList || []}
          inputValue={value}
          onClick={innerClick}
        />
      )}

      <KeyboardSafeArea>
        <View style={[GStyles.flexRow, styles.inputContainer]}>
          <CommonInput
            // autoFocus
            // grayBorder
            theme="black-bg"
            ref={iptRef}
            value={value}
            allowClear
            clearIcon="clear4"
            type="search"
            clearIconColor={theme.colors.bgBase2}
            onChangeText={v => {
              setValue(v);
              onSearch(value);
            }}
            onSubmitEditing={() => onSearch(value, true)}
            returnKeyType="go"
            placeholder={t('dApps, Sites, URL')}
            rightIconContainerStyle={styles.rightIconContainerStyle}
          />
        </View>
      </KeyboardSafeArea>
    </>
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

const getStyles = makeStyles(theme => ({
  header: {
    paddingLeft: pTd(16),
    height: pTd(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    ...GStyles.paddingArg(16, 16),
    backgroundColor: theme.colors.bgBase2,
    borderTopWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },

  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
}));
