import { useCallback, useEffect, useState } from 'react';
import { getVerifierList } from '../../utils/sandboxUtil/getVerifierList';
import { VerifierItem } from '@portkey/did';
import { AccountTypeEnum, OperationTypeEnum } from '@portkey/services';
import { GuardianApproval } from '@portkey/did-ui-react';
import { BaseGuardianItem, SetAllowance, did, handleErrorMessage } from '@portkey/did-ui-react';
import { useCurrentChain, useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { IAllowance } from '@portkey/did-ui-react/dist/_types/src/components/SetAllowance/index.component';
import { useLoading } from 'store/Provider/hooks';
import BackHeader from 'components/BackHeader';
import { IGuardiansApproved } from '@portkey/did-ui-react';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { DEFAULT_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { request } from '@portkey-wallet/api/api-did';
import { ManagerApproveInnerProps } from '@portkey/did-ui-react/dist/_types/src/components/ManagerApprove/index.component';

export enum ManagerApproveStep {
  SetAllowance = 'SetAllowance',
  GuardianApproval = 'GuardianApproval',
}

const PrefixCls = 'manager-approval';

export default function ManagerApproveInner({
  originChainId,
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
  const [allowance, setAllowance] = useState<string>(
    divDecimals(amount.toString(), tokenInfo?.decimals || DEFAULT_DECIMAL).toFixed(),
  );
  const [guardianList, setGuardianList] = useState<BaseGuardianItem[]>();
  const { setLoading } = useLoading();

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

  const chainInfo = useCurrentChain(originChainId);
  const { walletInfo } = useCurrentWallet();

  const getTokenInfo = useCallback(async () => {
    try {
      if (!chainInfo) throw Error('Missing verifier, please check params');
      const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
      const pin = getSeedResult.data.privateKey;
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
      if (!privateKey) throw 'Invalid user information, please check';
      const contract = await new ExtensionContractBasic({
        privateKey,
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.defaultToken.address,
      });
      const result = await contract.callViewMethod('GetTokenInfo', {
        symbol,
      });
      setTokenInfo(result.data);
    } catch (error) {
      console.error(error);
      onError?.(Error('GetTokenInfo error'));
    }
  }, [chainInfo, onError, symbol, walletInfo]);

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
          recommendedAmount={divDecimals(amount, tokenInfo?.decimals || DEFAULT_DECIMAL).toFixed()}
          max={divDecimals(LANG_MAX, tokenInfo?.decimals || DEFAULT_DECIMAL).toFixed()}
          dappInfo={dappInfo}
          onCancel={onCancel}
          onConfirm={allowanceConfirm}
        />
      )}

      {step === ManagerApproveStep.GuardianApproval && guardianList && (
        <GuardianApproval
          className={`${PrefixCls}-guardian-approve`}
          header={<BackHeader leftCallBack={() => setStep(ManagerApproveStep.SetAllowance)} />}
          originChainId={originChainId}
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
              amount: timesDecimals(allowance, tokenInfo?.decimals || DEFAULT_DECIMAL).toFixed(0),
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
