import { setCurrentGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { Button, message } from 'antd';
import CommonModal from 'components/CommonModal';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CommonSelect from 'components/CommonSelect1';
import { useTranslation } from 'react-i18next';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import { verification } from 'utils/api';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleError } from '@portkey-wallet/utils';
import { useVerifyToken } from 'hooks/authentication';
import { setRegisterVerifierAction } from 'store/reducers/loginCache/actions';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useOnManagerAddressAndQueryResult } from 'hooks/useOnManagerAddressAndQueryResult';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import './index.less';
import { RecaptchaType } from '@portkey-wallet/types/verifier';

export default function SelectVerifier() {
  const { verifierMap } = useGuardiansInfo();
  const { loginAccount } = useLoginInfo();
  const [open, setOpen] = useState<boolean>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const originChainId = useOriginChainId();
  const onManagerAddressAndQueryResult = useOnManagerAddressAndQueryResult('register');
  const { address: managerAddress } = useCurrentWalletInfo();

  const handleChange = useCallback((value: string) => {
    setSelectVal(value);
  }, []);

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item) => ({
        value: item.id,
        verifierUrl: item.imageUrl ?? '',
        label: item.name,
      })),
    [verifierMap],
  );

  const [selectVal, setSelectVal] = useState<string>(selectOptions?.[0]?.value);

  const selectItem = useMemo(() => verifierMap?.[selectVal], [selectVal, verifierMap]);

  const verifyToken = useVerifyToken();

  const verifyHandler = useCallback(async () => {
    try {
      if (!loginAccount || !LoginType[loginAccount.loginType] || !loginAccount.guardianAccount)
        return message.error('User registration information is invalid, please fill in the registration method again');
      if (!selectItem) return message.error('Can not get verification');

      setLoading(true);

      const result = await verification.sendVerificationCode({
        params: {
          guardianIdentifier: loginAccount.guardianAccount.replaceAll(' ', ''),
          type: LoginType[loginAccount.loginType],
          verifierId: selectItem.id,
          chainId: originChainId,
          operationType: RecaptchaType.register,
        },
      });
      setLoading(false);
      if (result.verifierSessionId) {
        const _key = `${loginAccount.guardianAccount}&${selectItem.name}`;
        dispatch(
          setCurrentGuardianAction({
            isLoginAccount: true,
            verifier: selectItem,
            guardianAccount: loginAccount.guardianAccount,
            guardianType: loginAccount.loginType,
            verifierInfo: {
              sessionId: result.verifierSessionId,
              endPoint: result.endPoint,
            },
            key: _key,
            identifierHash: '',
            salt: '',
          }),
        );
        navigate('/register/verifier-account', { state: 'register' });
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error, 'verifyHandler');
      const _error = verifyErrorHandler(error);
      message.error(_error);
    }
  }, [dispatch, loginAccount, navigate, originChainId, selectItem, setLoading]);

  const verifierShow = useMemo(() => Object.values(verifierMap ?? {}).slice(0, 3), [verifierMap]);

  const onConfirmAuth = useCallback(async () => {
    try {
      setLoading(true);
      if (!loginAccount?.loginType) throw 'loginType is invalid';
      const rst = await verifyToken(loginAccount.loginType, {
        accessToken: loginAccount.authenticationInfo?.[loginAccount.guardianAccount || ''],
        id: loginAccount.guardianAccount,
        verifierId: selectItem?.id,
        chainId: originChainId,
      });
      dispatch(
        setRegisterVerifierAction({
          verifierId: selectItem?.id as string,
          verificationDoc: rst.verificationDoc,
          signature: rst.signature,
        }),
      );
      const res = await InternalMessage.payload(PortkeyMessageTypes.CHECK_WALLET_STATUS).send();
      setLoading(false);
      if (managerAddress && res.data.privateKey) {
        onManagerAddressAndQueryResult(res.data.privateKey, {
          verifierId: selectItem?.id as string,
          verificationDoc: rst.verificationDoc,
          signature: rst.signature,
        });
      } else {
        navigate('/login/set-pin/register');
      }
    } catch (error) {
      const msg = handleError(error);
      message.error(msg);
      setLoading(false);
    }
  }, [
    dispatch,
    loginAccount,
    managerAddress,
    navigate,
    onManagerAddressAndQueryResult,
    originChainId,
    selectItem?.id,
    setLoading,
    verifyToken,
  ]);

  const onConfirm = useCallback(async () => {
    switch (loginAccount?.loginType) {
      case LoginType.Apple:
      case LoginType.Google:
        onConfirmAuth();
        break;
      default: {
        setOpen(true);
        break;
      }
    }
  }, [loginAccount, onConfirmAuth]);

  return (
    <div className="common-page select-verifier-wrapper">
      <PortKeyTitle leftElement leftCallBack={() => navigate('/register/start/create')} />
      <div className="select-verifier-content" id="select-verifier-content">
        <div className="common-content1">
          <div className="title">{t('Select verifier')}</div>
        </div>
        <p className="description">
          {t(
            'Verifiers protect your account and help you recover your assets when they are subject to risks. Please note: The more diversified your verifiers are, the higher security your assets enjoy.',
          )}
        </p>
        <div className="common-content1">
          <CommonSelect className="verifier-select" value={selectVal} onChange={handleChange} items={selectOptions} />
          <p className="popular-title">{t('Popular')}</p>
          <ul className="popular-content">
            {verifierShow?.map((item) => (
              <li key={item.name} className="popular-item" onClick={() => handleChange(item.id)}>
                <BaseVerifierIcon src={item.imageUrl} fallback={item.name[0]} rootClassName="popular-item-image" />
                <p className="popular-item-name">{item.name}</p>
              </li>
            ))}
          </ul>
          <Button className="confirm-btn" type="primary" onClick={onConfirm}>
            {t('Confirm')}
          </Button>
        </div>
      </div>
      {loginAccount && (
        <CommonModal
          getContainer={'#select-verifier-content'}
          className="verify-confirm-modal"
          closable={false}
          open={open}
          width={320}
          onCancel={() => setOpen(false)}>
          <p className="modal-content">
            {`${t('verificationCodeTip1', { verifier: selectItem?.name })} `}
            <span className="bold">{loginAccount.guardianAccount}</span>
            {` ${t('verificationCodeTip2', { type: LoginType[loginAccount.loginType] })}`}
          </p>
          <div className="btn-wrapper">
            <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button type="primary" onClick={verifyHandler}>
              {t('Confirm')}
            </Button>
          </div>
        </CommonModal>
      )}
    </div>
  );
}
