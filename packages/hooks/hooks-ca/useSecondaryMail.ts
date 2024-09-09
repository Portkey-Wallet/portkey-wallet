import { useCallback, useEffect, useState } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { checkEmail } from '@portkey-wallet/utils/check';
import useLockCallback from '../useLockCallback';

export function useIsSecondaryMailSet() {
  const [secondaryEmail, setSecondaryEmail] = useState<string>('');
  const [showNotSet, setShowNotSet] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      await getSecondaryMail();
      setFetching(false);
    })();
  });
  const getSecondaryMail = useCallback(async () => {
    try {
      // setLoading(true);
      const res = await request.security.secondaryMail({ params: {} });
      setSecondaryEmail(res?.secondaryEmail || '');
      setShowNotSet(!(res?.secondaryEmail || ''));
      return res?.secondaryEmail;
    } catch (e) {
      return false;
    } finally {
      // setLoading(false);
    }
  }, []);
  const hideNotSetMark = useLockCallback(email => {
    setShowNotSet(false);
    setSecondaryEmail(email || '');
  }, []);
  return {
    fetching,
    secondaryEmail,
    showNotSet,
    getSecondaryMail,
    hideNotSetMark,
  };
}

export function useSecondaryMail(defaultMail?: string) {
  const [email, setEmail] = useState<string>(defaultMail || '');
  const [errorMessage, setErrorMessage] = useState('');
  const checkEmailValid = useCallback(() => {
    const message = checkEmail(email) || undefined;
    if (message) {
      setErrorMessage(message);
      return false;
    }
    return true;
  }, [email]);
  const sendSecondaryEmailCode = useCallback(async () => {
    const res = await request.security.sendSecondaryEmailCode({
      params: {
        secondaryEmail: email,
      },
    });
    return res;
  }, [email]);
  return {
    sendSecondaryEmailCode,
    email,
    setEmail,
    errorMessage,
    setErrorMessage,
    checkEmailValid,
  };
}

// export function useVerifierEmail() {
//   const [verifyCode, setVerifyCode] = useState<string>('');

//   useEffect(() => {
//     return () => {
//       setVerifyCode('');
//     };
//   }, []);
//   const onCodeChange = useCallback((code: string) => {
//     setVerifyCode(code);
//     setCodeError(false);
//   }, []);
//   const onCodeFinish = useCallback(
//     async (code: string) => {
//       try {
//         if (code && code.length === 6) {
//           if (!verifierSessionIdRef.current)
//             throw Error(`VerifierSessionId(${verifierSessionIdRef.current}) is invalid`);
//           setLoading(true);

//           const res = await checkVerifyCode(code, verifierSessionIdRef.current);
//           if (res) {
//             singleMessage.success('Save Success!');
//             onSetSecondaryMailboxSuccess?.();
//           }
//           setVerifyCode('');
//         } else {
//           throw Error('Please check if the PIN code is entered correctly');
//         }
//       } catch (error: any) {
//         setVerifyCode('');
//         setInputError(true);
//         singleMessage.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [checkVerifyCode, onSetSecondaryMailboxSuccess, setInputError],
//   );
//   const onReSend = useCallback(async () => {
//     try {
//       setLoading(true);
//       const result = await sendVerifyCode(value);
//       if (!result.verifierSessionId)
//         return console.warn('The request was rejected, please check whether the parameters are correct');
//       uiRef.current?.setTimer(MAX_TIMER);
//       verifierSessionIdRef.current = result.verifierSessionId;
//     } catch (e: any) {
//       singleMessage.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [sendVerifyCode, value]);
//   return {
//     onCodeChange,
//     onCodeFinish,
//     onReSend,
//   };
// }
