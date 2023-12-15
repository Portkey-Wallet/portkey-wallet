import React, { useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { useGStyles } from 'assets/theme/useGStyles';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { chainShowText } from '@portkey-wallet/utils';
import { FontStyles } from 'assets/theme/styles';
import { ChainId } from '@portkey-wallet/types';
import { CryptoItemType } from 'pages/Buy/types';

type ItemType = CryptoItemType;

type SelectListProps = {
  value?: string; // `${network}_${symbol}`
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
};

const SelectList = ({ list, callBack, value }: SelectListProps) => {
  const { t } = useLanguage();
  const gStyle = useGStyles();
  const [keyWord, setKeyWord] = useState<string>('');
  const symbolImages = useSymbolImages();

  const _list = useMemo(() => {
    const _keyWord = keyWord?.trim();
    return _keyWord === '' ? list : list.filter(item => item.crypto === _keyWord);
  }, [keyWord, list]);

  return (
    <ModalBody style={gStyle.overlayStyle} title={t('Select Crypto')} modalBodyType="bottom">
      <View style={styles.titleWrap}>
        <CommonInput
          containerStyle={styles.titleInputWrap}
          inputContainerStyle={styles.titleInputWrap}
          inputStyle={styles.titleInput}
          leftIconContainerStyle={styles.titleIcon}
          value={keyWord}
          placeholder={t('Search crypto')}
          onChangeText={setKeyWord}
        />
      </View>
      {_list.length ? (
        <ScrollView alwaysBounceVertical={false}>
          {_list.map(item => {
            return (
              <Touchable
                key={`${item.network}_${item.crypto}`}
                onPress={() => {
                  OverlayModal.hide();
                  callBack(item);
                }}>
                <View style={styles.itemRow}>
                  <CommonAvatar
                    hasBorder
                    title={item.crypto}
                    avatarSize={pTd(32)}
                    svgName={item.crypto === ELF_SYMBOL ? 'elf-icon' : undefined}
                    imageUrl={symbolImages[item.crypto]}
                  />
                  <View style={styles.itemContent}>
                    <View>
                      <TextL>{item.crypto}</TextL>
                      <TextM style={FontStyles.font7}>{`${chainShowText(item.networkName as ChainId)} ${
                        item.networkName
                      }`}</TextM>
                    </View>

                    {value !== undefined && value === `${item.network}_${item.crypto}` && (
                      <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                    )}
                  </View>
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
      ) : (
        <TextL style={styles.noResult}>{t('No results found')}</TextL>
      )}
    </ModalBody>
  );
};

const showList = (params: SelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList {...params} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showList,
};

const styles = StyleSheet.create({
  titleWrap: {
    paddingHorizontal: pTd(16),
    marginBottom: pTd(8),
  },
  titleLabel: {
    textAlign: 'center',
    marginVertical: pTd(16),
  },
  titleInputWrap: {
    height: pTd(44),
  },
  titleInput: {
    fontSize: pTd(14),
  },
  titleIcon: {
    marginLeft: pTd(16),
  },
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginHorizontal: pTd(20),
  },
  itemContent: {
    flex: 1,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(16),
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
});
