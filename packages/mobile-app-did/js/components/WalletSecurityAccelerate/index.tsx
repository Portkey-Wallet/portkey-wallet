import React, { useCallback, useMemo } from 'react';
import OverlayModal from '../OverlayModal';
import { Keyboard } from 'react-native';
import { CommonButtonProps } from 'components/CommonButton';
import { useAppDispatch } from 'store/hooks';
import { sleep } from '@portkey-wallet/utils';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey/provider-types';
import { useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { IAccelerateGuardian, getAccelerateGuardianTxId } from '@portkey-wallet/utils/securityTest';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { fixedGuardianParams, fixedGuardianApprovedParams } from '@portkey-wallet/utils/guardian';
import { TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { useGetCAContract } from 'hooks/contract';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { AlertBody } from 'components/ActionSheet';

function WalletSecurityAccelerateAlertBody({
  accelerateChainId,
  originChainId,
  accelerateGuardian,
}: {
  accelerateChainId: ChainId;
  originChainId: ChainId;
  accelerateGuardian?: IAccelerateGuardian;
}) {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppCASelector(state => state.discover.isDrawerOpen);
  const getChain = useGetChain();
  const getCAContract = useGetCAContract();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();

  const accelerate = useCallback(async () => {
    if (!managerAddress || !caHash) return;

    let _accelerateGuardian = accelerateGuardian;
    let transactionId: string | undefined = _accelerateGuardian?.transactionId;

    if (!transactionId) {
      const result = await getAccelerateGuardianTxId(caHash, accelerateChainId, originChainId);
      if (result.isSafe) {
        // no need to accelerate
        return;
      }
      _accelerateGuardian = result.accelerateGuardian;
      transactionId = _accelerateGuardian?.transactionId;
      if (!transactionId) {
        throw new Error('transactionId not found');
      }
    }
    if (!_accelerateGuardian) throw new Error('accelerateGuardian not found');

    const chain = getChain(_accelerateGuardian.chainId);
    if (!chain) throw new Error('chain not found');

    const txResult = await getAelfTxResult(chain.endPoint, transactionId);
    console.log('txResult', txResult);
    if (txResult.Status !== TransactionStatus.Mined) throw new Error('Transaction failed');
    const params = JSON.parse(txResult.Transaction.Params);

    const caContract = await getCAContract(accelerateChainId);
    const req = await caContract.callSendMethod('AddGuardian', managerAddress, {
      caHash,
      guardianToAdd: fixedGuardianParams(params.guardianToAdd),
      guardiansApproved: fixedGuardianApprovedParams(params.guardiansApproved),
    });

    if (req && !req.error) {
      // accelerate success
      return;
    }

    throw new Error('Transaction failed');
  }, [accelerateChainId, accelerateGuardian, caHash, getCAContract, getChain, managerAddress, originChainId]);

  const buttons = useMemo((): {
    title: string;
    type: CommonButtonProps['type'];
    onPress?: () => void;
  }[] => {
    return [
      {
        title: 'Close',
        type: 'outline',
      },
      {
        title: 'Complete now',
        type: 'primary',
        onPress: async () => {
          Loading.show();
          try {
            await accelerate();
            CommonToast.success('Guardian added');
          } catch (error) {
            console.log('accelerate error', error);
            CommonToast.failError('Guardian failed to be added. Please wait a while for the addition to complete');
          }
          Loading.hide();
        },
      },
    ];
  }, [accelerate, dispatch, isDrawerOpen]);

  return (
    <AlertBody
      showInfoIcon
      title="Wallet security level upgrade in progress"
      message="Click “Complete now” to immediately complete the addition of a guardian, or close this window and wait for completion, which will take about 1-3 minutes."
      buttons={buttons}
    />
  );
}

const alert = async (accelerateChainId: ChainId, originChainId: ChainId, accelerateGuardian?: IAccelerateGuardian) => {
  Keyboard.dismiss();
  OverlayModal.show(
    <WalletSecurityAccelerateAlertBody
      accelerateChainId={accelerateChainId}
      accelerateGuardian={accelerateGuardian}
      originChainId={originChainId}
    />,
    { modal: true, type: 'zoomOut', position: 'bottom' },
  );
  await sleep(300);
};
export default {
  alert,
};
