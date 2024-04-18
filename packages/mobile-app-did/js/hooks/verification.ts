import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  useAppleAuthentication,
  useFacebookAuthentication,
  useGoogleAuthentication,
  useTelegramAuthentication,
  useTwitterAuthentication,
} from './authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useCallback } from 'react';
import { verification } from 'utils/api';
import { OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import { useGuardiansInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import navigationService from 'utils/navigationService';

export const useGetCurrentLoginAccountVerifyFunc = () => {
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const { telegramSign } = useTelegramAuthentication();
  const { twitterSign } = useTwitterAuthentication();
  const { facebookSign } = useFacebookAuthentication();
  const originChainId = useOriginChainId();
  const { userGuardiansList } = useGuardiansInfo();
  const guardianType = userGuardiansList?.[0].guardianType;

  const emailSign = useCallback(async () => {
    const req = await verification.sendVerificationCode({
      params: {
        type: LoginType[LoginType.Email],
        guardianIdentifier: userGuardiansList?.[0].guardianAccount,
        verifierId: userGuardiansList?.[0].verifier?.id,
        chainId: originChainId,
        operationType: OperationTypeEnum.revokeAccount,
      },
    });

    if (req.verifierSessionId) {
      navigationService.navigate('VerifierDetails', {
        guardianItem: userGuardiansList?.[0],
        requestCodeResult: {
          verifierSessionId: req.verifierSessionId,
        },
        verificationType: VerificationType.revokeAccount,
      });
    } else {
      throw new Error('send email fail');
    }
  }, [originChainId, userGuardiansList]);

  switch (guardianType) {
    case LoginType.Apple:
      return appleSign;
    case LoginType.Google:
      return googleSign;
    case LoginType.Facebook:
      return facebookSign;
    case LoginType.Telegram:
      return telegramSign;
    case LoginType.Twitter:
      return twitterSign;
    case LoginType.Email:
      return emailSign;
    default:
      throw 'no verify func ';
  }
};
