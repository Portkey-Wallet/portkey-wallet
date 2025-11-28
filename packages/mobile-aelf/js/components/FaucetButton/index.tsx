import React, { memo, useCallback, useRef } from 'react';
import { useLanguage } from 'i18n/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useGetCurrentTokenClaimContract } from 'hooks/contract';
import CommonToast from 'components/CommonToast';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';

import { DefaultChainId } from '@portkey-wallet/constants/constants-eoa/network';

type TSendButtonProps = TOutlinedStyleProps;

const FaucetButton = (props: TSendButtonProps) => {
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const getCurrentTokenClaimContract = useGetCurrentTokenClaimContract(DefaultChainId);
  const isLoading = useRef<boolean>(false);

  const claimToken = useCallback(async () => {
    CommonToast.loading('Your ELF is on its way');

    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    try {
      const tokenClaimContract = await getCurrentTokenClaimContract();

      const rst = await tokenClaimContract.callSendMethod('ClaimToken', '');
      if (rst.error) {
        throw rst.error;
      }
      CommonToast.success('Token successfully requested');
    } catch (error) {
      console.log(error);
      CommonToast.fail("Today's limit has been reached");
    }
    isLoading.current = false;
  }, [getCurrentTokenClaimContract]);

  const onPressButton = useCallback(() => {
    if (isMainnet) {
      return;
    }
    claimToken();
  }, [claimToken, isMainnet]);

  return <OutlinedButton {...props} iconName="faucet" title={t('Faucet')} onPress={onPressButton} />;
};

export default memo(FaucetButton);
