import React, { memo, useCallback, useState } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLanguage } from 'i18n/hooks';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import NFTAvatar from 'components/NFTAvatar';
import CommonButton from 'components/CommonButton';
import CommonInfoRow from 'components/CommonInfoRow';
import { ActionType } from 'types/common';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { pTd } from 'utils/unit';
import { getStyles } from './style';
import { ChainId } from '@portkey-wallet/types';

export enum FooterType {
  'E_BRIDGE' = 'eBridge',
  'E_TRANSFER' = 'eTransfer',
}

interface INFTInfo {
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  imageUrl: string;
  alias?: string;
  collectionName: string;
  tokenId: string;
}

interface ISendReceivePreviewProps {
  actionType: ActionType;
  footerType?: FooterType;
  amount: string;
  amountUSD?: string;
  toAddress?: string;
  toInfoChainId?: ChainId;
  fromAddress?: string;
  fromInfoChainId?: ChainId;
  sourceNetwork?: string;
  sourceNetworkImageUrl?: string;
  destinationNetwork?: string;
  destinationNetworkImageUrl?: string;
  transactionFee?: string;
  transactionFeeUSD?: string;
  estimatedNetworkFee?: string;
  estimatedNetworkFeeUSD?: string;
  amountToReceive?: string;
  amountToReceiveUSD?: string;
  estimatedDuration?: string;
  NFTInfo?: INFTInfo;
  isError?: boolean;
  onPress?: () => void;
}

const ACTION_CONFIG = {
  [ActionType.SEND]: {
    topIcon: <Svg icon="send-thin" size={pTd(44)} />,
    buttonText: 'Send',
  },
  [ActionType.RECEIVE]: {
    topIcon: <Svg icon="arrow-down-thin" size={pTd(44)} />,
    buttonText: 'Bridge to aelf',
  },
} as const;

const FOOTER_CONFIG = {
  [FooterType.E_TRANSFER]: <Svg icon="ETransferLogo" oblongSize={[pTd(70), pTd(12)]} />,
  [FooterType.E_BRIDGE]: <Svg icon="eBridgeLogo" oblongSize={[pTd(47), pTd(12)]} />,
};

const SendReceivePreview: React.FC<ISendReceivePreviewProps> = ({
  actionType,
  footerType,
  amount,
  amountUSD,
  toAddress,
  toInfoChainId,
  fromAddress,
  fromInfoChainId,
  sourceNetwork,
  sourceNetworkImageUrl,
  destinationNetwork,
  destinationNetworkImageUrl,
  transactionFee,
  transactionFeeUSD,
  estimatedNetworkFee,
  estimatedNetworkFeeUSD,
  amountToReceive,
  amountToReceiveUSD,
  estimatedDuration,
  NFTInfo,
  isError = false,
  onPress,
}) => {
  const { t } = useLanguage();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const { topIcon, buttonText } = ACTION_CONFIG[actionType] || {};

  const [isLoading, setIsLoading] = useState(false);

  const getChainSvgName = (chainId?: ChainId) => {
    if (!chainId) return undefined;
    return chainId === 'AELF' ? 'mainnet' : 'sideChain';
  };

  const handlePress = useCallback(() => {
    setIsLoading(true);
    onPress?.();
  }, [onPress]);

  return (
    <PageContainer
      titleDom={t(`Preview`)}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      rightDom={<Svg iconStyle={styles.headerHelpIcon} icon={isLoading ? 'help-gray' : 'help-white'} size={pTd(24)} />}
      scrollViewProps={{ disabled: true }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View>
            <View style={styles.topIconWrap}>{topIcon}</View>
            {NFTInfo ? (
              <View style={styles.nftInfoRow}>
                <View style={styles.nftInfoLeft}>
                  <Text style={styles.nftInfoName}>{`${NFTInfo.alias} #${NFTInfo.tokenId}`}</Text>
                  <Text style={styles.nftInfoCollection}>{NFTInfo.collectionName}</Text>
                </View>
                <NFTAvatar
                  disabled
                  isSeed={NFTInfo.isSeed}
                  seedType={NFTInfo.seedType}
                  nftSize={pTd(42)}
                  badgeSizeType="normal"
                  data={{
                    imageUrl: NFTInfo.imageUrl,
                    alias: NFTInfo.alias,
                  }}
                  style={styles.nftInfoRight}
                />
              </View>
            ) : (
              <View style={styles.amountInfoWrap}>
                <View style={styles.amountAboveWrap}>
                  <Text style={styles.amountAbove}>{amount}</Text>
                </View>
                {!!amountUSD && isMainnet && <Text style={styles.amountBelow}>{amountUSD}</Text>}
              </View>
            )}
            <View style={styles.infoWrap}>
              {fromAddress && (
                <CommonInfoRow label={{ text: 'From' }} value={{ text: formatStr2EllipsisStr(fromAddress) }} />
              )}
              {toAddress && <CommonInfoRow label={{ text: 'To' }} value={{ text: formatStr2EllipsisStr(toAddress) }} />}
              {sourceNetwork && (
                <CommonInfoRow
                  label={{ text: 'Source network' }}
                  value={{
                    text: sourceNetwork,
                    leftImageUrl: sourceNetworkImageUrl,
                    leftSvgName: getChainSvgName(fromInfoChainId),
                  }}
                />
              )}
              {destinationNetwork && (
                <CommonInfoRow
                  label={{ text: 'Destination network' }}
                  value={{
                    text: destinationNetwork,
                    leftImageUrl: destinationNetworkImageUrl,
                    leftSvgName: getChainSvgName(toInfoChainId),
                  }}
                />
              )}
              {!!transactionFee && (
                <CommonInfoRow
                  label={{
                    text: 'Transaction fee',
                    tooltipProps: {
                      title: 'Transaction fee',
                      description: 'Fee applied by the cross-chain bridge to process your transaction on blockchains.',
                    },
                    textBelow: isError ? 'Not enough ELF' : '',
                  }}
                  value={{ text: transactionFee, textBelow: isMainnet ? transactionFeeUSD : '' }}
                  isError={isError}
                />
              )}
              {!!estimatedNetworkFee && (
                <CommonInfoRow
                  label={{
                    text: 'Estimated network fee',
                    tooltipProps: {
                      title: 'Estimated network fee',
                      description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
                    },
                  }}
                  value={{ text: estimatedNetworkFee, textBelow: isMainnet ? estimatedNetworkFeeUSD : '' }}
                />
              )}
              {!!amountToReceive && (
                <CommonInfoRow
                  label={{ text: 'Amount to receive' }}
                  value={{ text: amountToReceive, textBelow: isMainnet ? amountToReceiveUSD : '' }}
                />
              )}
              {!!estimatedDuration && (
                <CommonInfoRow label={{ text: 'Estimated duration' }} value={{ text: `~${estimatedDuration}` }} />
              )}
            </View>
            {footerType && (
              <View style={styles.footerWrap}>
                <Text style={styles.footerText}>Powered by</Text>
                {FOOTER_CONFIG[footerType]}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <CommonButton title={buttonText} type="primary" loading={isLoading} disabled={isError} onPress={handlePress} />
    </PageContainer>
  );
};

export default memo(SendReceivePreview);
