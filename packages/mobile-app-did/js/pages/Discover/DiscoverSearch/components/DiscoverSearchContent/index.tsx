import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import CommonInput from 'components/CommonInput';

import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
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
    (inputValue: string) => {
      const newValue = inputValue.replace(/\s+/g, '');
      if (!newValue) {
        return;
      }

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
    },
    [flatList, onDiscoverJump],
  );

  const innerClick = useCallback(() => {
    isInner && onBack?.();
  }, [isInner, onBack]);

  return (
    <>
      <Touchable
        style={{
          marginLeft: pTd(16),
          marginVertical: pTd(12),
        }}
        onPress={onBack}>
        <Svg icon={'discover_close'} size={pTd(20)} color={theme.colors.iconBase1} />
      </Touchable>

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
            onSubmitEditing={() => onSearch(value)}
            returnKeyType="search"
            placeholder={t('dApps, Sites, URL')}
            containerStyle={styles.inputStyle}
            // rightIcon={
            //   value ? (
            //     <Touchable onPress={clearText}>
            //       <Svg icon="clear3" size={pTd(16)} />
            //     </Touchable>
            //   ) : undefined
            // }
            rightIconContainerStyle={styles.rightIconContainerStyle}
            // style={styles.rnInputStyle}
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
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(12, 16, 8),
    backgroundColor: theme.colors.bgBase2,
  },
  inputStyle: {
    //
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
  iconWrap: {
    padding: pTd(10),
    borderRadius: pTd(20),
    borderWidth: 1,
    borderColor: theme.colors.borderNeutral2,
    marginLeft: pTd(8),
  },
}));
