import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { bottomBarHeight } from '@portkey-wallet/utils-mobile/device';
import { TextM, TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { darkColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { useDiscoverWhiteList } from 'hooks/discover';
import { getProtocolAndHost, isDangerousLink } from '@portkey-wallet/utils/dapp/browser';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

type HttpModalPropsType = {
  uri: string;
};

export default function HttpModal(props: HttpModalPropsType) {
  const { uri } = props;

  const { t } = useLanguage();
  const [isShowHttpModal, setIsShowHttpModal] = useState(false);
  const { checkIsInWhiteList, upDateWhiteList } = useDiscoverWhiteList();

  const disableHttp = useCallback(() => {
    upDateWhiteList(getProtocolAndHost(uri));
    setIsShowHttpModal(false);
  }, [upDateWhiteList, uri]);

  useEffectOnce(() => {
    const protocolAndHost = getProtocolAndHost(uri);
    if (!checkIsInWhiteList(protocolAndHost) && isDangerousLink(protocolAndHost)) {
      return setIsShowHttpModal(true);
    }
  });

  return (
    <View style={[styles.wrap, !isShowHttpModal && styles.hidden]}>
      <View style={styles.tipsWrap}>
        <Svg icon="warning-fill" size={32} iconStyle={{ marginRight: pTd(10) }} />
        <Touchable onPress={() => setIsShowHttpModal(false)} style={styles.iconWrap}>
          <Svg icon="close" size={20} color={darkColors.iconBase1} />
        </Touchable>
      </View>
      <View style={styles.contentWrap}>
        <TextL style={styles.tips}>{t('You are accessing an insecure site')}</TextL>
        <TextM style={styles.tips}>{t('Be cautious with your personal information and account security.')}</TextM>
        <View style={styles.buttonGroupWrap}>
          <Touchable onPress={disableHttp}>
            <TextM style={[styles.buttonBaseStyle, buttonStyles.type1Button]}>{t('Disable notifications')}</TextM>
          </Touchable>
          <Touchable onPress={() => setIsShowHttpModal(false)}>
            <TextM style={[styles.buttonBaseStyle, buttonStyles.type2Button]}>{t('Continue')}</TextM>
          </Touchable>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  wrap: {
    left: 0,
    right: 0,
    backgroundColor: darkColors.bgBase1,
    bottom: -bottomBarHeight,
    position: 'absolute',
    zIndex: 999,
    ...GStyles.paddingArg(8),
  },
  tipsWrap: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  hidden: {
    display: 'none',
  },
  iconWrap: {
    padding: pTd(10),
  },
  contentWrap: {
    ...GStyles.paddingArg(12, 12, 16),
  },
  tips: {
    color: darkColors.textBase1,
    marginBottom: pTd(12),
  },
  buttonGroupWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: pTd(10),
    paddingBottom: pTd(26),
  },
  buttonBaseStyle: {
    width: pTd(160),
    height: pTd(44),
    backgroundColor: 'white',
    borderRadius: pTd(22),
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: pTd(44),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'yellow',
  },
});

export const buttonStyles = StyleSheet.create({
  type1Button: {
    borderColor: darkColors.borderBase1,
    backgroundColor: 'transparent',
    color: darkColors.textBase1,
  },
  type2Button: {
    borderWidth: 0,
    backgroundColor: darkColors.bgBrand1,
    color: darkColors.textBrand4,
  },
});
