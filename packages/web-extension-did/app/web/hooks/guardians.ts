import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';

export const useGuardiansNavigate = () => {
  const { isPrompt } = useCommonState();
  const navigate = useNavigate();
  return useCallback(
    (params: any) => {
      // TODO
      isPrompt
        ? navigate('/setting/guardians/guardian-approval', {
            state: `setTransferLimit_${JSON.stringify(params)}`,
          })
        : InternalMessage.payload(
            PortkeyMessageTypes.GUARDIANS_APPROVAL_PAYMENT_SECURITY,
            `setTransferLimit_${JSON.stringify(params)}`,
          ).send();
    },
    [isPrompt, navigate],
  );
};
