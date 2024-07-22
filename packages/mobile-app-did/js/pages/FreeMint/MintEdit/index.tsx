import React, { useState, useCallback, useEffect, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet, View } from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';

import { useGStyles } from 'assets/theme/useGStyles';

export type ShowMintEditParamsType = {
  // imTransferInfo?: ImTransferInfoType;
  // toAddress?: string;
};

const MintEdit = (props: ShowMintEditParamsType) => {
  // const { addresses, isGroupChat, toUserId } = imTransferInfo || {};

  const { t } = useLanguage();
  const gStyles = useGStyles();

  return (
    <ModalBody modalBodyType="bottom" title={t('Select Assets')} style={gStyles.overlayStyle}>
      {/* no assets in this account  */}
    </ModalBody>
  );
};

export const showMintEdit = (params?: ShowAssetListParamsType) => {
  OverlayModal.show(<MintEdit {...params} />, {
    position: 'bottom',
    autoKeyboardInsets: false,
    enabledNestScrollView: true,
  });
};

export default {
  showMintEdit,
};

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
    fontSize: pTd(20),
  },
  containerStyle: {
    marginLeft: pTd(16),
    width: pTd(343),
    marginBottom: pTd(8),
  },
  inputContainerStyle: {
    height: pTd(44),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
  },
});

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  noPic: {
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
    fontSize: pTd(20),
    textAlign: 'center',
    lineHeight: pTd(48),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tokenName: {
    flex: 1,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
  },
  nftItemInfo: {
    marginTop: pTd(2),
  },
  font14: {
    fontSize: pTd(14),
  },
});
