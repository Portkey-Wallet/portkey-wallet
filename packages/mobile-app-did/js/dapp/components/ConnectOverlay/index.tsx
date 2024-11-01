import React, { useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL, TextM, TextS } from 'components/CommonText';
import { useCurrentCaInfo, useCurrentUserInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr, sleep } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useGStyles } from 'assets/theme/useGStyles';
import { CommonButtonProps } from 'components/CommonButton';
import DappInfoSection from '../DappInfoSection';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { RememberInfoType, RememberMe } from 'components/RememberMe';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import { isIOS } from '@rneui/base';
import Touchable from 'components/Touchable';
import { copyText } from 'utils';
import Svg from 'components/Svg';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';

type ConnectModalType = {
  dappInfo: DappStoreItem;
  onReject: () => void;
  onApprove: () => void;
};

const ConnectModal = (props: ConnectModalType) => {
  const { dappInfo, onReject, onApprove } = props;
  const { t } = useLanguage();
  const pin = usePin();
  const defaultToken = useDefaultToken();
  const caInfo = useCurrentCaInfo();
  const { currentNetwork } = useWallet();
  const { nickName = '' } = useCurrentUserInfo();
  const gStyles = useGStyles();
  const updateSessionInfo = useUpdateSessionInfo();

  const [rememberInfo, setRememberMeInfo] = useState<RememberInfoType>({
    isRemember: false,
    value: SessionExpiredPlan.hour1,
  });

  const { accountTokenList } = useAccountTokenInfo();

  const caInfoList = useMemo(() => {
    const list: any[] = [];
    Object.entries(caInfo || {}).map(([key, value]) => {
      const info = value as CAInfo;
      if (info?.caAddress) {
        list.push({
          chaiId: key,
          caAddress: info.caAddress,
          ...accountTokenList.find(token => token.chainId === key && token.symbol === defaultToken.symbol),
        });
      }
    });
    return list;
  }, [accountTokenList, caInfo, defaultToken.symbol]);

  const ButtonList = useMemo(
    () => [
      {
        title: t('Reject'),
        type: 'outline' as CommonButtonProps['type'],
        onPress: () => {
          onReject?.();
          OverlayModal.hide();
        },
      },
      {
        title: t('Approve'),
        type: 'primary' as CommonButtonProps['type'],
        onPress: async () => {
          onApprove?.();
          OverlayModal.hide();

          await sleep(500);
          if (!pin) {
            return;
          }
          if (rememberInfo.isRemember) {
            updateSessionInfo({
              manager: getManagerAccount(pin),
              origin: dappInfo.origin,
              expiredPlan: rememberInfo?.value || SessionExpiredPlan.hour1,
            });
          }
        },
      },
    ],
    [dappInfo.origin, onApprove, onReject, pin, rememberInfo.isRemember, rememberInfo?.value, t, updateSessionInfo],
  );

  return (
    <ModalBody modalBodyType="bottom" title={t('Connect Wallet')} onClose={onReject}>
      <View style={[styles.contentWrap, gStyles.overlayStyle]}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextM style={[styles.walletTitle, FontStyles.font3]}>{t('Wallet')}</TextM>
        <View style={styles.group}>
          <TextL style={(FontStyles.font5, fonts.mediumFont)}>{nickName}</TextL>
          {caInfoList?.map((item, index) => (
            <View key={item?.chaiId} style={[styles.itemWrap, !!index && styles.itemBorderTop]}>
              <View>
                <TextM>{formatStr2EllipsisStr(addressFormat(item?.caAddress, item?.chaiId as ChainId), 8)}</TextM>
                <TextS style={styles.itemChainInfo}>
                  {formatChainInfoToShow(item?.chaiId as ChainId, currentNetwork)}
                </TextS>
              </View>
              <View style={styles.copyBtnWrap}>
                <Touchable onPress={() => copyText(addressFormat(item?.caAddress, item?.chainId as ChainId))}>
                  <Svg icon="copy" size={pTd(16)} />
                </Touchable>
              </View>
              <View>
                <TextS>{`${formatTokenAmountShowWithDecimals(item?.balance, item?.decimals)} ${item?.symbol}`}</TextS>
                <TextS style={styles.itemChainInfo} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList}>
        <RememberMe dappInfo={dappInfo} rememberInfo={rememberInfo} setRememberMeInfo={setRememberMeInfo} />
      </OverlayBottomSection>
    </ModalBody>
  );
};

export const showConnectModal = (props: ConnectModalType) => {
  OverlayModal.show(<ConnectModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

export default {
  showConnectModal,
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  favIcon: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginBottom: pTd(8),
    marginTop: pTd(24),
  },
  title: {
    marginBottom: pTd(2),
  },
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginTop: pTd(8),
    borderRadius: pTd(6),
    ...GStyles.paddingArg(16, 16, 0),
  },
  walletTitle: {
    marginTop: pTd(24),
    paddingLeft: pTd(10),
  },
  itemWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
  },
  itemBorderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  itemChainInfo: {
    marginTop: pTd(4),
  },
  btn: {
    width: pTd(160),
    height: pTd(44),
  },

  buttonGroup: {
    backgroundColor: defaultColors.bg1,
    position: 'absolute',
    bottom: 0,
    ...GStyles.paddingArg(10, 20, 16, 20),
  },
  buttonStyle: {
    height: pTd(48),
    fontSize: pTd(18),
  },
  buttonTitleStyle: {
    fontSize: pTd(16),
  },
  copyBtnWrap: {
    flex: 1,
    height: '100%',
    paddingTop: pTd(2),
    paddingLeft: pTd(8),
  },
});
