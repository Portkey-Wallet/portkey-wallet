import {
  SetPinBase,
  CreatePendingInfo,
  DIDWalletInfo,
  AddManagerType,
  OnErrorFunc,
  setLoading,
} from '@portkey/did-ui-react';
import { useCallback, useEffect, useRef } from 'react';
import singleMessage from 'utils/singleMessage';
import clsx from 'clsx';
import { ChainId } from '@portkey-wallet/types';
import type { AccountType, GuardiansApproved } from '@portkey/services';
import useLoginWallet from 'hooks/useLoginWallet';
import { handleErrorMessage } from '@portkey-wallet/utils';

export interface ISetPinAndAddManagerProps {
  type: AddManagerType;
  className?: string;
  accountType: AccountType;
  keyboard?: boolean;
  chainId: ChainId;
  guardianIdentifier?: string;
  onlyGetPin?: boolean;
  guardianApprovedList: GuardiansApproved[];
  onError?: OnErrorFunc;
  onFinish: (values: DIDWalletInfo | string) => void;
  onCreatePending?: (pendingInfo: CreatePendingInfo) => void;
}

export default function SetPinAndAddManager(props: ISetPinAndAddManagerProps) {
  const {
    type,
    className,
    onlyGetPin,
    guardianIdentifier,
    chainId,
    accountType,
    guardianApprovedList,
    onFinish,
    onCreatePending,
    onError,
  } = props;
  const onFinishRef = useRef<ISetPinAndAddManagerProps['onFinish']>(onFinish);
  const createWallet = useLoginWallet({ onCreatePending, onError });

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  const onCreate = useCallback(
    async (pin: string) => {
      if (onlyGetPin) return onFinishRef.current(pin);
      if (!guardianIdentifier) {
        singleMessage.error('No guardianIdentifier');
        onError?.({
          errorFields: 'createWallet',
          error: 'No guardianIdentifier',
        });
        return;
      }

      const params = {
        pin,
        type,
        chainId,
        accountType,
        guardianIdentifier,
        guardianApprovedList,
      };
      try {
        const createResult = await createWallet(params);
        createResult && onFinishRef.current(createResult);
      } catch (error) {
        setLoading(false);
        console.log('===SetPinAndAddManager error', error);
        singleMessage.error(handleErrorMessage(error));
      }
    },
    [accountType, chainId, createWallet, guardianApprovedList, guardianIdentifier, onError, onlyGetPin, type],
  );

  const onFinishFailed = useCallback(
    (err: any) => {
      singleMessage.error(`Form Error: ${err.errorFields?.[0]?.name}`);
      onError?.({
        errorFields: 'SetPinAndAddManager Form',
        error: `Form Error: ${err.errorFields?.[0]?.name}`,
      });
      return;
    },
    [onError],
  );

  return (
    <SetPinBase
      className={clsx('portkey-card-height', 'portkey-ui-set-pin-pc', className)}
      onFinish={onCreate}
      onFinishFailed={onFinishFailed}
    />
  );
}
