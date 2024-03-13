import { GuardianApproval, UserGuardianStatus } from '@portkey/did-ui-react';
import CustomPromptModal from '../CustomPromptModal';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useState } from 'react';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { OperationTypeEnum as OperationTypeEnumSDK } from '@portkey/services';
import singleMessage from 'utils/singleMessage';
import { GuardiansApproved } from '@portkey/services';
import { useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import { AccountType } from '@portkey-wallet/types/wallet';
import './index.less';
import { GuardianItem } from 'types/guardians';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { getAuthToken } from 'store/Provider/initConfig';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';

interface GuardianApprovalModalProps {
  open: boolean;
  targetChainId: ChainId;
  operationType: OperationTypeEnum;
  onClose: () => void;
  getApproveRes: (list: GuardianItem[]) => void;
}

const PrefixCls = 'guardian-approval-modal';

export default function GuardianApproveModal({
  open,
  targetChainId,
  operationType,
  onClose,
  getApproveRes,
}: GuardianApprovalModalProps) {
  const originChainId = useOriginChainId();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { verifierMap } = useGuardiansInfo();
  const currentNetwork = useCurrentNetwork();
  const [guardianList, setGuardianList] = useState<UserGuardianStatus[]>();

  const getGuardianList = useCallback(async () => {
    const res = await getHolderInfo({
      chainId: originChainId,
      caHash: walletInfo.caHash,
    });

    const { guardians } = res?.guardianList ?? { guardians: [] };
    const guardianAccounts = [...guardians];
    const _guardianList: UserGuardianStatus[] = guardianAccounts.map((item) => {
      const key = `${item.guardianIdentifier}&${item.verifierId}`;
      const _guardian = {
        ...item,
        identifier: item.guardianIdentifier,
        key,
        guardianType: item.type as AccountType,
        verifier: verifierMap?.[item.verifierId],
      };
      return _guardian;
    });
    setGuardianList(_guardianList);
  }, [originChainId, verifierMap, walletInfo.caHash]);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      await getGuardianList();
      await getAuthToken();
    } catch (error) {
      setLoading(false);
      console.log('getData error', error);
    } finally {
      setLoading(false);
    }
  }, [getGuardianList, setLoading]);

  const onApproveSuccess = useCallback(
    async (approvalInfo: GuardiansApproved[]) => {
      try {
        setLoading(true);
        const guardiansApproved: GuardianItem[] =
          approvalInfo?.map((item) => ({
            type: item?.type ? LoginType[item.type] : LoginType.Email,
            identifierHash: item?.identifierHash,
            verificationInfo: {
              id: item.verifierId,
              signature: Object.values(Buffer.from(item?.signature as any, 'hex')) as any,
              verificationDoc: item.verificationDoc,
            },
          })) || [];
        getApproveRes(guardiansApproved);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [getApproveRes, setLoading],
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CustomPromptModal open={open} wrapClassName={`${PrefixCls}-wrapper`} destroyOnClose onClose={onClose}>
      <GuardianApproval
        networkType={currentNetwork}
        className={`${PrefixCls}-content`}
        originChainId={originChainId}
        targetChainId={targetChainId}
        guardianList={guardianList}
        onConfirm={onApproveSuccess}
        onError={(error) => singleMessage.error(handleErrorMessage(error.error))}
        operationType={operationType as OperationTypeEnumSDK}
      />
    </CustomPromptModal>
  );
}
