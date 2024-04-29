import { useCallback, useMemo } from 'react';
import VerifyAccountCancelPrompt from './Prompt';
import useLogOut from 'hooks/useLogout';
import { deleteLoginAccount } from '@portkey-wallet/utils/deleteAccount';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGuardiansInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useNavigateState } from 'hooks/router';
import VerifyCodeBody from '../components/VerifyCodeBody';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import VerifyAccountCancelPopup from './Popup';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export interface ICodeFinishParams {
  code: string;
  verifierSessionId: string;
}

export interface IVerifyAccountCancel {
  headerTitle?: string;
  renderContent: JSX.Element;
  onBack: () => void;
}

export default function VerifyAccountCancelation() {
  const logout = useLogOut();
  const navigate = useNavigateState();
  const { setLoading } = useLoading();
  const { isNotLessThan768 } = useCommonState();
  const originChainId = useOriginChainId();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const uniqueGuardian = useMemo(() => userGuardiansList?.[0], [userGuardiansList]);
  const originChainInfo = useCurrentChain(originChainId);

  const onCodeFinish = useCallback(
    async ({ code, verifierSessionId }: ICodeFinishParams) => {
      try {
        if (!originChainInfo) throw 'Missing chainInfo, please check';
        const { privateKey } = await getSeed();
        if (!privateKey) throw 'Missing pin, please check';
        const contract = new ExtensionContractBasic({
          privateKey,
          rpcUrl: originChainInfo.endPoint,
          contractAddress: originChainInfo.caContractAddress,
        });
        const _type = LoginType[uniqueGuardian?.guardianType as LoginType];
        setLoading(true);
        await deleteLoginAccount({
          removeManagerParams: {
            caContract: contract,
            managerAddress,
            caHash: caHash as string,
          },
          deleteParams: {
            type: _type,
            chainId: originChainId,
            token: code,
            guardianIdentifier: uniqueGuardian?.guardianAccount,
            verifierSessionId,
            verifierId: uniqueGuardian?.verifier?.id ?? '',
          },
        });
        logout();
      } catch (error) {
        console.log('===onCodeFinish error', error);
        singleMessage.error(handleErrorMessage(error ?? 'Account Cancelation error'));
      } finally {
        setLoading(false);
      }
    },
    [
      caHash,
      logout,
      managerAddress,
      originChainId,
      originChainInfo,
      setLoading,
      uniqueGuardian?.guardianAccount,
      uniqueGuardian?.guardianType,
      uniqueGuardian?.verifier?.id,
    ],
  );

  const renderContent = useMemo(() => <VerifyCodeBody onCodeFinish={onCodeFinish} />, [onCodeFinish]);

  const props: IVerifyAccountCancel = useMemo(
    () => ({
      renderContent,
      onBack: () => navigate('/setting/wallet/account-cancelation'),
    }),
    [navigate, renderContent],
  );

  return isNotLessThan768 ? <VerifyAccountCancelPrompt {...props} /> : <VerifyAccountCancelPopup {...props} />;
}
