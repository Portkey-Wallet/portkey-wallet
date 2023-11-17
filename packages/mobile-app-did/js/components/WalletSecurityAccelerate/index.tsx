import React, { useCallback, useMemo } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Keyboard, StyleSheet, Image } from 'react-native';
import ButtonRow from 'components/ButtonRow';
import { CommonButtonProps } from 'components/CommonButton';
import securityWarning from 'assets/image/pngs/securityWarning.png';
import { defaultColors } from 'assets/theme';
import { TextM, TextXL } from 'components/CommonText';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { useAppDispatch } from 'store/hooks';
import { sleep } from '@portkey-wallet/utils';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey/provider-types';
import { useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { IAccelerateGuardian, getAccelerateGuardianTxId } from '@portkey-wallet/utils/securityTest';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { useGetCAContract } from 'hooks/contract';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Svg from 'components/Svg';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

function AlertBody({
  accelerateChainId,
  originChainId,
  accelerateGuardian,
}: {
  accelerateChainId: ChainId;
  originChainId: ChainId;
  accelerateGuardian: IAccelerateGuardian;
}) {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppCASelector(state => state.discover.isDrawerOpen);
  const getChain = useGetChain();
  const getCAContract = useGetCAContract();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();

  const accelerate = useCallback(async () => {
    if (!managerAddress || !caHash) return;

    const chain = getChain(accelerateGuardian.chainId);
    console.log('chain', chain);
    if (!chain) throw new Error('chain not found');
    let transactionId: string | undefined = accelerateGuardian.transactionId;
    if (!transactionId) {
      const result = await getAccelerateGuardianTxId(caHash, accelerateChainId, originChainId);
      if (result.isSafe) return;
      transactionId = result.transactionId;
      if (!transactionId) {
        throw new Error('transactionId not found');
      }
    }

    const txResult = await getAelfTxResult(chain.endPoint, accelerateGuardian.transactionId);
    console.log('txResult', txResult);
    if (txResult.Status !== TransactionStatus.Mined) throw new Error('Transaction failed');
    const params = JSON.parse(txResult.Transaction.Params);
    console.log('params', params);

    const caContract = await getCAContract(accelerateChainId);
    const req = await caContract.callSendMethod('AddGuardian', managerAddress, {
      caHash,
      guardianToAdd: params.guardianToAdd,
      guardiansApproved: params.guardiansApproved,
    });
    console.log('req', req);

    if (req && !req.error) {
      // TODO: check if the tx is successful
      CommonToast.success('');
    }
    console.log('req', req);
  }, [
    accelerateChainId,
    accelerateGuardian.chainId,
    accelerateGuardian.transactionId,
    caHash,
    getCAContract,
    getChain,
    managerAddress,
    originChainId,
  ]);

  const buttons = useMemo((): {
    title: string;
    type: CommonButtonProps['type'];
    onPress: () => void;
  }[] => {
    return [
      {
        title: 'Accelerate',
        type: 'primary',
        onPress: async () => {
          OverlayModal.hide();
          Loading.show();
          try {
            await accelerate();
          } catch (error) {
            console.log('error', error);
            // TODO: toast error
          }
          Loading.hide();

          if (isDrawerOpen) {
            await sleep(250);
            dispatch(changeDrawerOpenStatus(false));
          }
        },
      },
    ];
  }, [accelerate, dispatch, isDrawerOpen]);

  const onClose = useCallback(() => {
    OverlayModal.hide();
  }, []);

  return (
    <View style={styles.alertBox}>
      <View onTouchEnd={onClose} style={styles.closeWrap}>
        <Svg icon={'close'} size={pTd(12.5)} color={defaultColors.font7} />
      </View>

      <Image resizeMode="cover" source={securityWarning} style={styles.img} />
      <TextXL style={styles.alertTitle}>Wallet security check in progress</TextXL>
      <TextM style={styles.alertMessage}>
        {
          'We are testing the security of your wallet, which will take about 1-3 minutes. You can click "Accelerate" to complete the test immediately.'
        }
      </TextM>
      <ButtonRow buttons={buttons} />
    </View>
  );
}

const alert = async (accelerateChainId: ChainId, originChainId: ChainId, accelerateGuardian: IAccelerateGuardian) => {
  Keyboard.dismiss();
  OverlayModal.show(
    <AlertBody
      accelerateChainId={accelerateChainId}
      accelerateGuardian={accelerateGuardian}
      originChainId={originChainId}
    />,
    {
      modal: true,
      type: 'zoomOut',
      position: 'center',
    },
  );
  await sleep(300);
};
export default {
  alert,
};

export const styles = StyleSheet.create({
  itemText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    fontSize: pTd(16),
  },
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(16),
    ...fonts.mediumFont,
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
  img: {
    width: pTd(180),
    height: pTd(108),
    marginBottom: pTd(16),
  },
  closeWrap: {
    width: pTd(20),
    height: pTd(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: pTd(12),
    top: pTd(12),
  },
});
