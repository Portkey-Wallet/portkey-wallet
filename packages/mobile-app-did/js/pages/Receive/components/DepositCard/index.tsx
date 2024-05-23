import React, { useCallback, useRef, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { TextM, TextS } from 'components/CommonText';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { copyText } from 'utils';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import fonts from 'assets/theme/fonts';

export enum DepositMode {
  DEPOSIT = 1,
  EXCHANGE = 2,
}

export interface IDepositCardProps {
  token: TokenItemShowType;
  mode: DepositMode;
  onClickDepositButton?: () => void; //only available when DEPOSIT
}

const thirdPartyServiceIcons = [
  {
    name: 'binance',
    icon: require('../../../../assets/image/pngs/third-party-binance.png'),
  },
  {
    name: 'bitthumb',
    icon: require('../../../../assets/image/pngs/third-party-bithumb.png'),
  },
  {
    name: 'upbit',
    icon: require('../../../../assets/image/pngs/third-party-upbit.png'),
  },
  {
    name: 'huobi',
    icon: require('../../../../assets/image/pngs/third-party-huobi.png'),
  },
  {
    name: 'okx',
    icon: require('../../../../assets/image/pngs/third-party-okx.png'),
  },
  {
    name: 'gate.io',
    icon: require('../../../../assets/image/pngs/third-party-gate.io.png'),
  },
];

export default function DepositCard(props: IDepositCardProps) {
  const { token, mode, onClickDepositButton } = props;
  const { chainId } = token;
  const [copyChecked, setCopyChecked] = useState(false);
  const copyForwarder = useRef<NodeJS.Timeout | null>(null);
  const currentWallet = useCurrentWalletInfo();
  const currentCaAddress = currentWallet?.[chainId]?.caAddress;

  useEffectOnce(() => {
    return () => {
      if (copyForwarder.current) {
        clearTimeout(copyForwarder.current);
      }
    };
  });

  const copyId = useCallback(() => {
    copyText(currentCaAddress ?? '');
    setCopyChecked(true);
    copyForwarder.current = setTimeout(() => {
      setCopyChecked(false);
      copyForwarder.current = null;
    }, 2000);
  }, [currentCaAddress]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Svg
          icon={mode === DepositMode.DEPOSIT ? 'deposit-service' : 'exchange-service'}
          size={160}
          iconStyle={styles.cardIcon}
        />
        <TextM style={styles.cardText}>{mode === DepositMode.DEPOSIT ? cardTips.deposit : cardTips.exchange}</TextM>
      </View>
      <View style={styles.functionalArea}>
        {mode === DepositMode.EXCHANGE && (
          <View>
            <View style={styles.candiedHawsIcon}>
              {thirdPartyServiceIcons.map((item, index) => (
                <Image source={item.icon} key={index} style={[styles.candiedHawsItem, { zIndex: -1 * index }]} />
              ))}
            </View>
            <View style={styles.copyButton}>
              <View style={styles.copyButtonTextLines}>
                <TextM style={[styles.copyButtonMainText, fonts.mediumFont]}>
                  {`Receive ${token.symbol} from top-tier exchanges`}
                </TextM>
                <TextS style={styles.copyButtonSubText}>{'Click to copy your address'}</TextS>
              </View>
              <TouchableOpacity onPress={copyId}>
                <Svg icon={copyChecked ? 'copy-checked' : 'copy1'} size={pTd(32)} iconStyle={styles.copyButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {mode === DepositMode.DEPOSIT && (
          <TouchableOpacity onPress={onClickDepositButton} style={styles.depositButton}>
            <View style={styles.depositButtonLeft}>
              <Svg icon="deposit-receive" size={40} iconStyle={styles.depositButtonIcon} />
              <TextM style={[styles.depositButtonText, fonts.mediumFont]}>{'Select deposit network'}</TextM>
            </View>
            <Svg icon="right-arrow" size={16} iconStyle={styles.jumpIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const cardTips = {
  deposit: 'Enjoy effortless cross-chain functionality and deposit assets directly into your Portkey wallet.',
  exchange: 'Experience seamless asset transfers from cryptocurrency exchanges to your Portkey wallet.',
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(48),
    marginBottom: pTd(72),
    paddingHorizontal: pTd(24),
    height: pTd(258),
  },
  cardIcon: {
    flex: 1,
  },
  cardText: {
    textAlign: 'center',
    lineHeight: pTd(22),
    marginTop: pTd(32),
    color: defaultColors.font5,
  },
  functionalArea: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
    padding: pTd(12),
    minHeight: pTd(66),
    width: '100%',
  },
  candiedHawsIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: pTd(16),
    marginLeft: pTd(12),
  },
  candiedHawsItem: {
    height: pTd(40),
    width: pTd(40),
    borderRadius: pTd(40),
    marginLeft: pTd(-12),
  },
  copyButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyButtonTextLines: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  copyButtonMainText: {
    color: defaultColors.font5,
    lineHeight: pTd(22),
  },
  copyButtonSubText: {
    color: defaultColors.font11,
    lineHeight: pTd(26),
    paddingTop: pTd(4),
  },
  copyButtonIcon: {
    height: pTd(32),
    width: pTd(32),
    borderRadius: pTd(6),
  },
  depositButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositButtonLeft: {
    flex: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  depositButtonIcon: {
    width: pTd(40),
    height: pTd(40),
  },
  depositButtonText: {
    lineHeight: pTd(22),
    color: defaultColors.font5,
    marginLeft: pTd(12),
  },
  jumpIcon: {
    flex: 1,
    height: pTd(16),
    width: pTd(16),
    marginLeft: pTd(12),
  },
});