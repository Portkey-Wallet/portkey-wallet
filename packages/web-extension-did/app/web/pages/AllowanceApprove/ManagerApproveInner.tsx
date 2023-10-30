import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVerifierList } from '../../utils/sandboxUtil/getVerifierList';
import { VerifierItem } from '@portkey/did';
import { AccountTypeEnum, OperationTypeEnum } from '@portkey/services';
import {
  GuardianApproval,
  BaseGuardianItem,
  SetAllowance,
  did,
  IAllowance,
  handleErrorMessage,
  IGuardiansApproved,
  ManagerApproveInnerProps,
} from '@portkey/did-ui-react';
import { useCurrentChain, useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useLoading } from 'store/Provider/hooks';
import BackHeader from 'components/BackHeader';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { DEFAULT_DECIMAL, DEFAULT_NFT_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { request } from '@portkey-wallet/api/api-did';
import { isNFT } from 'utils';

export enum ManagerApproveStep {
  SetAllowance = 'SetAllowance',
  GuardianApproval = 'GuardianApproval',
}

const PrefixCls = 'manager-approval';

export default function ManagerApproveInner({
  originChainId,
  targetChainId,
  caHash,
  amount,
  dappInfo,
  symbol,
  onCancel,
  onFinish,
  onError,
}: ManagerApproveInnerProps) {
  const [step, setStep] = useState<ManagerApproveStep>(ManagerApproveStep.SetAllowance);
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string;
    tokenName: string;
    supply: string;
    totalSupply: string;
    decimals: number;
    issuer: string;
    isBurnable: true;
    issueChainId: number;
    issued: string;
  }>();
  const [guardianList, setGuardianList] = useState<BaseGuardianItem[]>();
  const { setLoading } = useLoading();

  const DEFAULT_SYMBOL_DECIMAL = useMemo(() => (isNFT(symbol) ? DEFAULT_NFT_DECIMAL : DEFAULT_DECIMAL), [symbol]);
  const [allowance, setAllowance] = useState<string>(divDecimals(amount, DEFAULT_SYMBOL_DECIMAL).toFixed());

  const getChainInfo = useGetChainInfo();

  const getVerifierListHandler = useCallback(async () => {
    const currentChain = await getChainInfo(originChainId);
    if (!currentChain) throw 'Miss chain info';
    const verifierRes = await getVerifierList({
      rpcUrl: currentChain.endPoint,
      address: currentChain.caContractAddress,
      chainType: 'aelf',
    });
    return verifierRes.result.verifierList as VerifierItem[];
  }, [getChainInfo, originChainId]);

  const getGuardianList = useCallback(async () => {
    const verifierList = await getVerifierListHandler();
    const verifierMap: { [x: string]: VerifierItem } = {};
    verifierList.forEach((item) => {
      verifierMap[item.id] = item;
    });

    const payload = await did.getHolderInfo({
      chainId: originChainId,
      caHash,
    });

    const { guardians } = payload?.guardianList ?? { guardians: [] };
    return guardians.map((_guardianAccount) => {
      const key = `${_guardianAccount.guardianIdentifier}&${_guardianAccount.verifierId}`;

      const guardianAccount = _guardianAccount.guardianIdentifier || _guardianAccount.identifierHash;
      const verifier = verifierMap?.[_guardianAccount.verifierId];

      const baseGuardian: BaseGuardianItem = {
        ..._guardianAccount,
        key,
        verifier,
        identifier: guardianAccount,
        guardianType: _guardianAccount.type,
      };
      return baseGuardian;
    });
  }, [caHash, getVerifierListHandler, originChainId]);

  const allowanceConfirm = useCallback(
    async (allowanceInfo: IAllowance) => {
      try {
        setAllowance(allowanceInfo.allowance);
        setLoading(true);

        const guardianList = await getGuardianList();
        // set Authorization
        const requestDefaults = did.config.requestDefaults ? did.config.requestDefaults : {};
        const token = await request.getConnectToken();
        if (!token) return;
        if (!requestDefaults.headers) requestDefaults.headers = {};
        requestDefaults.headers = {
          ...requestDefaults?.headers,
          Authorization: token,
        };
        did.setConfig({ requestDefaults });

        setGuardianList(guardianList);
        setStep(ManagerApproveStep.GuardianApproval);
        setLoading(false);
      } catch (error) {
        onError?.(Error(handleErrorMessage(error)));
        setLoading(false);
      }
    },
    [getGuardianList, onError, setLoading],
  );

  const targetChainInfo = useCurrentChain(targetChainId);
  const { walletInfo } = useCurrentWallet();

  const getTokenInfo = useCallback(async () => {
    try {
      if (!targetChainInfo) throw Error('Missing verifier, please check params');
      const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
      const pin = getSeedResult.data.privateKey;
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
      if (!privateKey) throw 'Invalid user information, please check';
      const contract = await new ExtensionContractBasic({
        privateKey,
        rpcUrl: targetChainInfo.endPoint,
        contractAddress: targetChainInfo.defaultToken.address,
      });
      const result = await contract.callViewMethod('GetTokenInfo', {
        symbol,
      });
      if (!result.data) throw `${symbol} does not exist in this chain`;
      setTokenInfo(result.data);
      setAllowance(divDecimals(amount, result.data?.decimals).toFixed());
    } catch (error) {
      console.error(error);
      onError?.(Error(handleErrorMessage(error)));
    }
  }, [amount, targetChainInfo, onError, symbol, walletInfo.AESEncryptPrivateKey]);

  useEffect(() => {
    getTokenInfo();
  }, [getTokenInfo]);

  return (
    <div className="portkey-ui-flex-column portkey-ui-manager-approval-wrapper">
      {step === ManagerApproveStep.SetAllowance && (
        <SetAllowance
          className="portkey-ui-flex-column"
          symbol={symbol}
          amount={allowance}
          decimals={tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL}
          recommendedAmount={divDecimals(amount, tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL).toFixed()}
          max={divDecimals(LANG_MAX, tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL).toFixed(0)}
          dappInfo={dappInfo}
          onCancel={onCancel}
          onAllowanceChange={setAllowance}
          onConfirm={allowanceConfirm}
        />
      )}

      {step === ManagerApproveStep.GuardianApproval && guardianList && (
        <GuardianApproval
          className={`${PrefixCls}-guardian-approve`}
          header={<BackHeader leftCallBack={() => setStep(ManagerApproveStep.SetAllowance)} />}
          originChainId={originChainId}
          targetChainId={targetChainId}
          guardianList={guardianList}
          onConfirm={(approvalInfo) => {
            const approved: IGuardiansApproved[] = approvalInfo.map((guardian) => ({
              type: AccountTypeEnum[guardian.type || 'Google'],
              identifierHash: guardian.identifierHash || '',
              verificationInfo: {
                id: guardian.verifierId,
                signature: Object.values(Buffer.from(guardian.signature as any, 'hex')),
                verificationDoc: guardian.verificationDoc,
              },
            }));
            onFinish?.({
              amount: timesDecimals(allowance, tokenInfo?.decimals || DEFAULT_SYMBOL_DECIMAL).toFixed(0),
              guardiansApproved: approved,
            });
          }}
          onError={(error) => onError?.(Error(handleErrorMessage(error.error)))}
          operationType={OperationTypeEnum.managerApprove}
        />
      )}
    </div>
  );
}
