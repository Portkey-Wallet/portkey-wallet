import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  useAppleAuthentication,
  useFacebookAuthentication,
  useGoogleAuthentication,
  useTelegramAuthentication,
  useTwitterAuthentication,
} from './authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useCallback, useMemo } from 'react';
import { verification } from 'utils/api';
import { OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';
import { useGuardiansInfo } from '@portkey-wallet/hooks/hooks-ca/guardian';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import { parseTwitterToken } from '@portkey-wallet/utils/authentication';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';

export const useGetCurrentLoginAccountVerifyFunc = () => {
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const { telegramSign } = useTelegramAuthentication();
  const { twitterSign } = useTwitterAuthentication();
  const { facebookSign } = useFacebookAuthentication();
  const originChainId = useOriginChainId();
  const { userGuardiansList } = useGuardiansInfo();
  const verifyManagerAddress = useVerifyManagerAddress();
  const guardianType = useMemo(() => userGuardiansList?.[0].guardianType, [userGuardiansList]);

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
        operationDetails: getOperationDetails(OperationTypeEnum.revokeAccount),
      });
    } else {
      throw new Error('send email fail');
    }
  }, [originChainId, userGuardiansList]);

  const socialSign = useCallback(async () => {
    let token = '';
    let id = '';
    switch (guardianType) {
      case LoginType.Apple: {
        const { identityToken, user } = await appleSign(verifyManagerAddress ?? '');
        token = identityToken;
        id = user.id;
        break;
      }
      case LoginType.Google: {
        const { accessToken, user } = await googleSign(verifyManagerAddress ?? '');
        token = accessToken;
        id = user.id;

        break;
      }
      case LoginType.Facebook: {
        const { user } = await facebookSign();
        token = user.accessToken;
        id = user.id;

        break;
      }
      case LoginType.Telegram: {
        const { accessToken, user } = await telegramSign();
        token = accessToken;
        id = user.id;

        break;
      }

      case LoginType.Twitter: {
        const { user, accessToken } = await twitterSign();
        id = user.id;
        const { accessToken: twitterToken } = parseTwitterToken(accessToken) ?? {};
        token = twitterToken || '';
        break;
      }
      default:
        throw 'No target sign type';
    }

    return {
      identityToken: token,
      user: {
        id,
      },
    };
  }, [appleSign, facebookSign, googleSign, guardianType, telegramSign, twitterSign, verifyManagerAddress]);

  return guardianType === LoginType.Email ? emailSign : socialSign;
};
