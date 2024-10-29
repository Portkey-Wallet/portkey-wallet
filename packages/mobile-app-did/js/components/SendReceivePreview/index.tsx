import React, { memo, useCallback, useState } from 'react';
import { Text, View, TouchableWithoutFeedback, ImageSourcePropType } from 'react-native';
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
import { pTd } from 'utils/unit';
import { getStyles } from './style';

interface INFTInfo {
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  imageUrl: string;
  alias?: string;
}

interface ISendReceivePreviewProps {
  actionType: ActionType;
  amount: string;
  amountUSD?: string;
  toAddress?: string;
  fromAddress?: string;
  sourceNetwork?: string;
  sourceNetworkIcon?: ImageSourcePropType;
  destinationNetwork?: string;
  destinationNetworkIcon?: ImageSourcePropType;
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
    footerIcon: <Svg icon="ETransferLogo" oblongSize={[pTd(70), pTd(12)]} />,
    buttonText: 'Send',
  },
  [ActionType.RECEIVE]: {
    topIcon: <Svg icon="arrow-down-thin" size={pTd(44)} />,
    footerIcon: <Svg icon="eBridgeLogo" oblongSize={[pTd(47), pTd(12)]} />,
    buttonText: 'Bridge to aelf',
  },
} as const;

const SendReceivePreview: React.FC<ISendReceivePreviewProps> = ({
  actionType,
  amount,
  amountUSD,
  toAddress,
  fromAddress,
  sourceNetwork,
  sourceNetworkIcon,
  destinationNetwork,
  destinationNetworkIcon,
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

  const { topIcon, footerIcon, buttonText } = ACTION_CONFIG[actionType] || {};

  const [isLoading, setIsLoading] = useState(false);

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
                  <Text style={styles.nftInfoName}>NFT Name #1234</Text>
                  <Text style={styles.nftInfoCollection}>Collection name</Text>
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
                {!!amountUSD && <Text style={styles.amountBelow}>{amountUSD}</Text>}
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
                  value={{ text: sourceNetwork, leftIcon: sourceNetworkIcon }}
                />
              )}
              {destinationNetwork && (
                <CommonInfoRow
                  label={{ text: 'Destination network' }}
                  value={{ text: destinationNetwork, leftIcon: destinationNetworkIcon }}
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
                  value={{ text: transactionFee, textBelow: transactionFeeUSD }}
                  isError={isError}
                />
              )}
              {!!estimatedNetworkFee && (
                <CommonInfoRow
                  label={{
                    text: 'Estimated gas fee',
                    tooltipProps: {
                      title: 'Estimated network fee',
                      description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
                    },
                  }}
                  value={{ text: estimatedNetworkFee, textBelow: estimatedNetworkFeeUSD }}
                />
              )}
              {!!amountToReceive && (
                <CommonInfoRow
                  label={{ text: 'Amount to receive' }}
                  value={{ text: amountToReceive, textBelow: amountToReceiveUSD }}
                />
              )}
              {!!estimatedDuration && (
                <CommonInfoRow label={{ text: 'Estimated duration' }} value={{ text: `~${estimatedDuration}` }} />
              )}
            </View>
            {!NFTInfo && (
              <View style={styles.footerWrap}>
                <Text style={styles.footerText}>Powered by</Text>
                {footerIcon}
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
