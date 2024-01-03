import { useCallback } from 'react';
import { SecurityCheck } from '@portkey/did-ui-react';
import { useNavigate } from 'react-router';
import { closeTabPrompt } from 'utils/lib/serviceWorkerAction';
import errorHandler from 'utils/errorHandler';
import usePromptSearch from 'hooks/usePromptSearch';
import { message } from 'antd';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleGuardianByContract } from 'utils/sandboxUtil/handleGuardianByContract';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { useLoading } from 'store/Provider/hooks';
import { getAccelerateGuardianTxId } from '@portkey-wallet/utils/securityTest';
import { SecurityAccelerateErrorTip } from 'constants/security';
import SecurityAccelerate from './SecurityAccelerate';
import { sleep } from '@portkey-wallet/utils';
import './index.less';

export default function WalletSecurityApprove() {
  const { showGuardian, accelerateGuardianTxId, accelerateChainId } = usePromptSearch<{
    showGuardian: boolean;
    showSync: boolean;
    accelerateChainId: ChainId;
    accelerateGuardianTxId?: string;
  }>();
  const navigate = useNavigate();
  const originChainId = useOriginChainId();
  const originChainInfo = useCurrentChain(originChainId);
  const accelerateChainInfo = useCurrentChain(accelerateChainId);
  const { walletInfo } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const { setLoading } = useLoading();

  const handleSyncGuardian = useCallback(
    async (accelerateTxId: string) => {
      try {
        const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
        const pin = getSeedResult.data.privateKey;
        const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);

        if (!accelerateChainInfo?.endPoint || !originChainInfo?.endPoint || !privateKey)
          return message.error(SecurityAccelerateErrorTip);

        const result = await getAelfTxResult(originChainInfo?.endPoint, accelerateTxId);
        if (result.Status !== 'MINED') return message.error(SecurityAccelerateErrorTip);
        const params = JSON.parse(result.Transaction.Params);

        await handleGuardianByContract({
          rpcUrl: accelerateChainInfo?.endPoint as string,
          chainType: currentNetwork.walletType,
          address: accelerateChainInfo?.caContractAddress as string,
          privateKey,
          paramsOption: {
            method: 'AddGuardian',
            params: {
              caHash: walletInfo?.caHash,
              guardianToAdd: params.guardianToAdd,
              guardiansApproved: params.guardiansApproved,
            },
          },
        });
        setLoading(false);
        message.success('Guardian added');
        await sleep(1000);
        closeTabPrompt(errorHandler(0, 'Guardian added'));
      } catch (error: any) {
        console.log('===add guardian accelerate error', error);
        message.error(SecurityAccelerateErrorTip);
      }
    },
    [
      currentNetwork.walletType,
      accelerateChainInfo?.caContractAddress,
      accelerateChainInfo?.endPoint,
      originChainInfo?.endPoint,
      walletInfo.AESEncryptPrivateKey,
      walletInfo?.caHash,
      setLoading,
    ],
  );

  const checkAccelerateIsReady = useCallback(async () => {
    try {
      setLoading(true);
      if (accelerateGuardianTxId) {
        await handleSyncGuardian(accelerateGuardianTxId);
      } else {
        if (!walletInfo?.caHash) message.error(SecurityAccelerateErrorTip);
        const res = await getAccelerateGuardianTxId(walletInfo?.caHash as string, accelerateChainId, originChainId);
        if (res.isSafe) {
          setLoading(false);
          message.success('Guardian added');
          await sleep(1000);
          closeTabPrompt(errorHandler(0, 'Guardian added'));
        } else if (res.accelerateGuardian?.transactionId) {
          await handleSyncGuardian(res.accelerateGuardian.transactionId);
        } else {
          message.error(SecurityAccelerateErrorTip);
        }
      }
    } catch (error: any) {
      console.log('===checkAccelerateIsReady error', error);
    } finally {
      setLoading(false);
    }
  }, [accelerateGuardianTxId, handleSyncGuardian, accelerateChainId, originChainId, walletInfo?.caHash, setLoading]);

  return (
    <div>
      {showGuardian ? (
        <div className="full-screen-height portkey-ui-flex-center wallet-security-approve">
          <SecurityCheck
            onConfirm={() => navigate('/setting/guardians', { state: { accelerateChainId } })}
            onCancel={() => {
              closeTabPrompt(errorHandler(200003));
            }}
          />
        </div>
      ) : (
        <div className="full-screen-height portkey-ui-flex-center wallet-security-approve">
          <SecurityAccelerate onConfirm={checkAccelerateIsReady} />
        </div>
      )}
    </div>
  );
}
