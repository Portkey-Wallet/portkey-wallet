import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { TextM, TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { useDiscoverWhiteList } from 'hooks/discover';
import { getProtocolAndHost, isDangerousLink } from '@portkey-wallet/utils/dapp/browser';
import Touchable from 'components/Touchable';

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
    if (!checkIsInWhiteList(protocolAndHost) && isDangerousLink(protocolAndHost)) return setIsShowHttpModal(true);
  });

  return (
    <View style={[styles.wrap, !isShowHttpModal && styles.hidden]}>
      <TextL style={styles.tips}>
        {t(
          'You are accessing an insecure site. Please be cautious about safeguarding your personal information and account security.',
        )}
      </TextL>
      <View style={styles.buttonGroupWrap}>
        <Touchable onPress={disableHttp}>
          <TextM style={[styles.buttonBaseStyle, buttonStyles.type1Button]}>{t('Disable notifications')}</TextM>
        </Touchable>
        <Touchable onPress={() => setIsShowHttpModal(false)}>
          <TextM style={[styles.buttonBaseStyle, buttonStyles.type2Button]}>{t('Continue')}</TextM>
        </Touchable>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  wrap: {
    left: 0,
    right: 0,
    backgroundColor: defaultColors.bg17,
    bottom: -bottomBarHeight,
    position: 'absolute',
    zIndex: 999,
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
    ...GStyles.paddingArg(24, 20),
  },
  hidden: {
    display: 'none',
  },
  tips: {
    color: defaultColors.font2,
    marginBottom: pTd(24),
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
    borderRadius: pTd(6),
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
    borderColor: defaultColors.bg1,
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font2,
  },
  type2Button: {
    borderWidth: 0,
    backgroundColor: defaultColors.bg1,
    color: defaultColors.font13,
  },
});
