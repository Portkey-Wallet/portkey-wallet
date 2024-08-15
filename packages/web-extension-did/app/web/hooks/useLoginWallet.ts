import { useCallback, useEffect, useRef } from 'react';
import AElf from 'aelf-sdk';
import { CreatePendingInfo, AddManagerType, did, OnErrorFunc } from '@portkey/did-ui-react';
import { LoginResult, RegisterResult } from '@portkey/did';
import type { AccountType, GuardiansApproved, RegisterStatusResult, RecoverStatusResult } from '@portkey/services';
import { ChainId } from '@portkey-wallet/types';
import { handleErrorMessage, randomId } from '@portkey-wallet/utils';
import { extraDataEncode } from '@portkey-wallet/utils/device';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { useLoading } from 'store/Provider/hooks';
import singleMessage from 'utils/singleMessage';
import { CurrentWalletType, useCurrentWallet, useTmpWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';

type onCreatePendingType = (pendingInfo: CreatePendingInfo) => void;

interface CreateWalletParams {
  pin: string;
  type: AddManagerType;
  chainId: ChainId;
  accountType: AccountType;
  guardianIdentifier: string;
  guardianApprovedList: GuardiansApproved[];
}

export interface ILoginWalletProps {
  onCreatePending?: onCreatePendingType;
  onError?: OnErrorFunc;
}

export default function useLoginWallet(props: ILoginWalletProps) {
  const { onCreatePending, onError } = props;
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const storeTmpWalletInfo = useTmpWalletInfo();
  const latestStoreTmpWalletInfo = useLatestRef(storeTmpWalletInfo);

  const onErrorRef = useRef<OnErrorFunc | undefined>(onError);
  const onCreatePendingRef = useRef<onCreatePendingType | undefined>(onCreatePending);

  useEffect(() => {
    onErrorRef.current = onError;
    onCreatePendingRef.current = onCreatePending;
  });

  const createTmpWalletInfo = useCallback(
    (walletInfo?: CurrentWalletType) => {
      console.log('createTmpWalletInfo', walletInfo, latestStoreTmpWalletInfo.current);
      if (walletInfo?.address) return walletInfo;
      if (latestStoreTmpWalletInfo.current?.address) return latestStoreTmpWalletInfo.current;
      return AElf.wallet.createNewWallet();
    },
    [latestStoreTmpWalletInfo],
  );

  const getRequestStatus = useCallback(
    async ({ sessionId, chainId, type }: { sessionId: string; chainId: ChainId; type: AddManagerType }) => {
      let status, error: Error | undefined;
      try {
        if (type === 'register') {
          status = await did.didWallet.getRegisterStatus({
            sessionId,
            chainId,
          });
          const { registerStatus } = status;

          if (registerStatus !== 'pass') {
            throw new Error((status as RegisterStatusResult).registerMessage);
          }
        } else {
          status = await did.didWallet.getLoginStatus({ sessionId, chainId });
          const { recoveryStatus } = status;

          if (recoveryStatus !== 'pass') {
            throw new Error((status as RecoverStatusResult).recoveryMessage);
          }
        }
      } catch (e: any) {
        error = e;
      }
      return { sessionId, status, error };
    },
    [],
  );

  const requestRegisterWallet = useCallback(
    async ({
      pin,
      chainId,
      accountType,
      guardianIdentifier,
      guardianApprovedList,
    }: Omit<CreateWalletParams, 'type'>) => {
      if (!guardianIdentifier || !accountType) throw 'Missing account!!! Please login/register again';
      if (!guardianApprovedList?.length) throw 'Missing guardianApproved';
      const wallet = createTmpWalletInfo(walletInfo);
      const managerAddress = wallet.address;
      const requestId = randomId();

      const clientId = managerAddress;

      const registerVerifier = guardianApprovedList[0];
      const extraData = await extraDataEncode(getDeviceInfo(DEVICE_TYPE));
      const params = {
        type: accountType,
        loginGuardianIdentifier: guardianIdentifier.replaceAll(/\s/g, ''),
        extraData,
        chainId,
        verifierId: registerVerifier.verifierId,
        verificationDoc: registerVerifier.verificationDoc,
        signature: registerVerifier.signature,
        zkLoginInfo: registerVerifier.zkLoginInfo,
        context: {
          clientId,
          requestId,
        },
      };

      const { sessionId } = await did.services.register({
        ...params,
        manager: managerAddress,
      });
      onCreatePendingRef.current?.({
        sessionId,
        requestId,
        clientId,
        pin,
        walletInfo: wallet,
        createType: 'register',
      });

      return getRequestStatus({
        chainId,
        sessionId,
        type: 'register',
      }) as Promise<RegisterResult>;
    },
    [createTmpWalletInfo, getRequestStatus, walletInfo],
  );

  const requestRecoveryWallet = useCallback(
    async ({
      pin,
      chainId,
      accountType,
      guardianIdentifier,
      guardianApprovedList,
    }: Omit<CreateWalletParams, 'type'>) => {
      if (!guardianIdentifier || !accountType) throw 'Missing account!!! Please login/register again';

      const wallet = createTmpWalletInfo(walletInfo);
      const managerAddress = wallet.address;
      const requestId = randomId();

      const clientId = managerAddress;

      const extraData = await extraDataEncode(getDeviceInfo(DEVICE_TYPE));

      const _guardianApprovedList = guardianApprovedList.filter((item) =>
        Boolean((item.signature && item.verificationDoc) || item.zkLoginInfo),
      );

      const params = {
        loginGuardianIdentifier: guardianIdentifier.replaceAll(/\s/g, ''),
        guardiansApproved: _guardianApprovedList,
        extraData,
        chainId,
        context: {
          clientId,
          requestId,
        },
      };

      const { sessionId } = await did.services.recovery({
        ...params,
        manager: managerAddress,
      });

      onCreatePendingRef.current?.({
        sessionId,
        requestId,
        clientId,
        pin,
        walletInfo: wallet,
        createType: 'recovery',
      });
      return getRequestStatus({
        chainId,
        sessionId,
        type: 'recovery',
      }) as Promise<LoginResult>;
    },
    [createTmpWalletInfo, getRequestStatus, walletInfo],
  );

  const createWallet = useCallback(
    async ({ pin, type, chainId, accountType, guardianIdentifier, guardianApprovedList }: CreateWalletParams) => {
      if (!guardianIdentifier) throw 'Missing account!!!';
      // did.reset();
      const loadingText =
        type === 'recovery' ? 'Initiating social recovery...' : 'Creating a wallet address on the blockchain';

      setLoading(true, loadingText);

      let walletResult: RegisterResult | LoginResult;
      const walletParams = {
        pin,
        chainId,
        accountType,
        guardianIdentifier,
        guardianApprovedList,
      };
      if (type === 'register') {
        walletResult = await requestRegisterWallet(walletParams);
      } else if (type === 'recovery') {
        walletResult = await requestRecoveryWallet(walletParams);
      } else {
        throw 'Param "type" error';
      }

      if (walletResult.error) {
        singleMessage.error(handleErrorMessage(walletResult.error));
        throw walletResult;
      }

      if (!walletResult.status?.caAddress || !walletResult.status?.caHash) {
        singleMessage.error('Missing "caAddress" or "caHash"');
        throw walletResult;
      }
      const wallet = createTmpWalletInfo(walletInfo);
      return {
        caInfo: {
          caAddress: walletResult.status.caAddress,
          caHash: walletResult.status.caHash,
        },
        accountInfo: {
          managerUniqueId: walletResult.sessionId,
          guardianIdentifier,
          accountType,
          type,
        },
        createType: type,
        chainId,
        pin,
        walletInfo: wallet,
      };
    },
    [setLoading, createTmpWalletInfo, walletInfo, requestRegisterWallet, requestRecoveryWallet],
  );

  return createWallet;
}
