import React, { memo, useCallback, useRef } from 'react';
import { useLanguage } from 'i18n/hooks';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from 'hooks/contract';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';

import { DefaultChainId } from '@portkey-wallet/constants/constants-eoa/network';

type TSendButtonProps = TOutlinedStyleProps;

const FaucetButton = (props: TSendButtonProps) => {
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const currentWallet = useCurrentWalletInfo();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const getCurrentCAContract = useGetCurrentCAContract(DefaultChainId);
  const isLoading = useRef<boolean>(false);

  const claimToken = useCallback(async () => {
    if (!currentWallet.address || !currentWallet.caHash || !currentNetworkInfo.tokenClaimContractAddress) {
      return;
    }
    CommonToast.loading('Your ELF is on its way');

    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    try {
      const caContract = await getCurrentCAContract();
      const rst = await caContract.callSendMethod('ManagerForwardCall', currentWallet.address, {
        caHash: currentWallet.caHash,
        contractAddress: currentNetworkInfo.tokenClaimContractAddress,
        methodName: 'ClaimToken',
        args: {
          symbol: 'ELF',
          amount: timesDecimals(100, 8).toFixed(0),
        },
      });
      if (rst.error) {
        throw rst.error;
      }
      CommonToast.success('Token successfully requested');
    } catch (error) {
      console.log(error);
      CommonToast.fail("Today's limit has been reached");
    }
    isLoading.current = false;
  }, [currentNetworkInfo.tokenClaimContractAddress, currentWallet.address, currentWallet.caHash, getCurrentCAContract]);

  const onPressButton = useCallback(() => {
    if (isMainnet) {
      return;
    }
    claimToken();
  }, [claimToken, isMainnet]);

  return <OutlinedButton {...props} iconName="faucet" title={t('Faucet')} onPress={onPressButton} />;
};

export default memo(FaucetButton);
