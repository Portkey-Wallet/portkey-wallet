import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback } from 'react';
import { track } from 'utils/amplitude';
import { BaseEvent } from '@amplitude/analytics-types';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const useAmplitudeTrack = () => {
  const isMainNet = useIsMainnet();

  return useCallback(
    (event: BaseEvent) => {
      track({
        user_properties: {
          network: isMainNet ? 'MAINNET' : 'TESTNET',
        },
        ...event,
      });
    },
    [isMainNet],
  );
};

export enum LoginTrackTypeEnum {
  Login = 'Login',
  SignUp = 'SignUp',
  Scan = 'Scan',
}
export type TLoginTrackParams = {
  loginType?: LoginType;
  type: LoginTrackTypeEnum;
};

export const useLoginTrack = () => {
  const amplitudeTrack = useAmplitudeTrack();

  return useCallback(
    ({ loginType, type }: TLoginTrackParams) => {
      amplitudeTrack({
        event_type: 'Login',
        event_properties: {
          loginType: loginType ? LoginType[loginType] : '',
          type,
        },
      });
    },
    [amplitudeTrack],
  );
};

export type TLoginSuccessTrackParams = TLoginTrackParams & {
  isPinNeeded: boolean;
};
export const useLoginSuccessTrack = () => {
  const amplitudeTrack = useAmplitudeTrack();

  return useCallback(
    ({ loginType, type, isPinNeeded }: TLoginSuccessTrackParams) => {
      amplitudeTrack({
        event_type: 'LoginSuccess',
        event_properties: {
          loginType: loginType ? LoginType[loginType] : '',
          type,
          isPinNeeded,
        },
      });
    },
    [amplitudeTrack],
  );
};

export type TEtransferCrossTrackParams = {
  chainId: string;
  toAddress: string;
  amount: string;
  symbol: string;
};
export const useEtransferCrossTrack = () => {
  const amplitudeTrack = useAmplitudeTrack();
  return useCallback(
    (params: TEtransferCrossTrackParams) => {
      amplitudeTrack({
        event_type: 'EtransferCross',
        event_properties: params,
      });
    },
    [amplitudeTrack],
  );
};

export type TEtransferCrossFinishTrack = {
  success: boolean;
  msg?: string;
};
export const useEtransferCrossFinishTrack = () => {
  const amplitudeTrack = useAmplitudeTrack();
  return useCallback(
    ({ success, msg }: TEtransferCrossFinishTrack) => {
      amplitudeTrack({
        event_type: 'EtransferCrossFinish',
        event_properties: {
          success,
          msg: msg || '',
        },
      });
    },
    [amplitudeTrack],
  );
};
