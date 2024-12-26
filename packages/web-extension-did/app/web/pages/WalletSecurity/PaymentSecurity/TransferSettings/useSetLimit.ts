import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { FromPageEnum } from 'types/router';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { useNavigateState } from 'hooks/router';

export const useSetLimit = () => {
  const { isPrompt } = useCommonState();
  const dispatch = useAppDispatch();
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const navigate = useNavigateState();

  const handleSetLimit = useThrottleCallback(
    async ({ singleLimit, dailyLimit, state, restricted }) => {
      // setLoading(true);
      try {
        // ====== clear guardian cache ====== start
        dispatch(
          setLoginAccountAction({
            guardianAccount: walletInfo.managerInfo?.loginAccount as string,
            loginType: walletInfo.managerInfo?.type as LoginType,
          }),
        );
        dispatch(resetUserGuardianStatus());
        await userGuardianList({ caHash: walletInfo.caHash });
        // ====== clear guardian cache ====== end

        // const { singleLimit, dailyLimit } = form.getFieldsValue();
        const params = {
          dailyLimit: timesDecimals(dailyLimit, state.decimals).toFixed(),
          singleLimit: timesDecimals(singleLimit, state.decimals).toFixed(),
          symbol: state.symbol,
          fromSymbol: state.fromSymbol,
          decimals: state.decimals,
          restricted: restricted,
          from: state.from,
          targetChainId: state.targetChainId || state.chainId,
          initStateBackUp: state,
          extra: state.extra,
        };
        // setLoading(false);
        const operationDetails = getOperationDetails(OperationTypeEnum.modifyTransferLimit, {
          symbol: state.symbol,
          singleLimit: restricted ? timesDecimals(singleLimit, state.decimals).toFixed() : '-1',
          dailyLimit: restricted ? timesDecimals(dailyLimit, state.decimals).toFixed() : '-1',
        });
        console.log('operationDetails: ', operationDetails);
        isPrompt
          ? navigate('/setting/wallet-security/payment-security/guardian-approval', {
              state: {
                previousPage: FromPageEnum.setTransferLimit,
                operationDetails,
                ...params,
              },
            })
          : await InternalMessage.payload(
              PortkeyMessageTypes.GUARDIANS_APPROVAL_PAYMENT_SECURITY,
              JSON.stringify({
                previousPage: FromPageEnum.setTransferLimit,
                operationDetails,
                ...params,
              }),
            ).send();
      } catch (error) {
        console.log('set limit error: ', error);
      }
    },
    [
      dispatch,
      walletInfo.managerInfo?.loginAccount,
      walletInfo.managerInfo?.type,
      walletInfo.caHash,
      userGuardianList,
      isPrompt,
      navigate,
    ],
  );
  return { handleSetLimit };
};
