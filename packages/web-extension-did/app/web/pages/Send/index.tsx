import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getAddressChainId, handleErrorMessage, isDIDAddress } from '@portkey-wallet/utils';
import { getAelfAddress, getEntireDIDAelfAddress, isCrossChain, isEqAddress } from '@portkey-wallet/utils/aelf';
import aes from '@portkey-wallet/utils/aes';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { Button, message, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAppDispatch, useCommonState, useLoading, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import crossChainTransfer, { intervalCrossChainTransfer } from 'utils/sandboxUtil/crossChainTransfer';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import AddressSelector from './components/AddressSelector';
import AmountInput from './components/AmountInput';
import SendPreview from './components/SendPreview';
import ToAccount from './components/ToAccount';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import getTransferFee from './utils/getTransferFee';
import { ZERO } from '@portkey-wallet/constants/misc';
import { TransactionError } from '@portkey-wallet/constants/constants-ca/assets';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { AddressCheckError } from '@portkey-wallet/store/store-ca/assets/type';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { ChainId } from '@portkey-wallet/types';
import { useCheckManagerSyncState } from 'hooks/wallet';
import './index.less';
import { useCheckLimit, useCheckSecurity } from 'hooks/useSecurity';
import { ExceedLimit, WalletIsNotSecure } from 'constants/security';
import { ICheckLimitBusiness } from '@portkey-wallet/types/types-ca/paymentSecurity';
import GuardianApproveModal from 'pages/components/GuardianApprovalModal';
import { GuardianItem } from 'types/guardians';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import CustomModal from 'pages/components/CustomModal';
import { SideChainTipContent, SideChainTipTitle } from '@portkey-wallet/constants/constants-ca/send';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import qs from 'query-string';

export type ToAccount = { address: string; name?: string };

export enum SendStage {
  'Address',
  'Amount',
  'Preview',
}

type TypeStageObj = {
  [key in SendStage]: { btnText: string; handler: () => void; backFun: () => void; element: ReactElement };
};

export interface SendRouteData {
  chainId: ChainId;
  targetChainId?: ChainId;
  symbol: string;
  address: string;
  decimals: number;
  tokenId: any;
  alias: string;
  imageUrl?: string;
  amount?: string;
  balance?: string;
  toAccount?: ToAccount;
  stage?: SendStage;
  showGuardiansApproveModal?: boolean;
}

export default function Send() {
  const navigate = useNavigate();
  const { walletName } = useWalletInfo();
  const { isPrompt } = useCommonState();
  // TODO need get data from state and wait for BE data structure
  const { type, symbol } = useParams();
  const { state, search } = useLocation();
  const { detail } = qs.parse(search);
  const routeData: SendRouteData = useMemo(() => {
    if (detail) {
      const detailObj = JSON.parse(detail);
      return { ...state, ...detailObj };
    }
    return state;
  }, [detail, state]);
  const chainId: ChainId = useMemo(
    () => routeData.targetChainId || routeData.chainId,
    [routeData.chainId, routeData.targetChainId],
  );
  const chainInfo = useCurrentChain(chainId);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();
  console.log(wallet, 'wallet===');
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [openGuardiansApprove, setOpenGuardiansApprove] = useState<boolean>(!!routeData?.showGuardiansApproveModal);
  const oneTimeApprovalList = useRef<GuardianItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [tipMsg, setTipMsg] = useState('');
  const [toAccount, setToAccount] = useState<ToAccount>(routeData?.toAccount || { address: '' });
  const [stage, setStage] = useState<SendStage>(routeData?.stage || SendStage.Address);
  const [amount, setAmount] = useState(routeData?.amount || '');
  const [balance, setBalance] = useState(routeData?.balance || '');
  const isValidSuffix = useIsValidSuffix();
  const checkManagerSyncState = useCheckManagerSyncState();
  const [txFee, setTxFee] = useState<string>();
  const currentChain = useCurrentChain(chainId);
  useFetchTxFee();
  const { crossChain: crossChainFee } = useGetTxFee(chainId);
  const tokenInfo: BaseToken = useMemo(
    () => ({
      chainId: chainId,
      decimals: routeData.decimals, // 8
      address: routeData?.address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        routeData address  contract address
      symbol: routeData.symbol, // "ELF"   the name showed
      name: routeData.symbol,
      imageUrl: routeData?.imageUrl,
      alias: routeData?.alias,
      tokenId: routeData?.tokenId,
    }),
    [
      chainId,
      routeData?.address,
      routeData?.alias,
      routeData.decimals,
      routeData?.imageUrl,
      routeData.symbol,
      routeData?.tokenId,
    ],
  );
  const defaultToken = useDefaultToken(chainId);

  const validateToAddress = useCallback(
    (value: { name?: string; address: string } | undefined) => {
      if (!value) return false;
      const suffix = getAddressChainId(toAccount.address, chainInfo?.chainId || 'AELF');
      if (!isDIDAddress(value.address) || !isValidSuffix(suffix)) {
        setErrorMsg(AddressCheckError.recipientAddressIsInvalid);
        return false;
      }
      const selfAddress = wallet?.[chainId]?.caAddress || '';
      if (isEqAddress(selfAddress, getAelfAddress(toAccount.address)) && suffix === chainId) {
        setErrorMsg(AddressCheckError.equalIsValid);
        return false;
      }
      setErrorMsg('');
      return true;
    },
    [chainId, chainInfo?.chainId, isValidSuffix, toAccount.address, wallet],
  );

  const btnDisabled = useMemo(() => {
    if (toAccount.address === '' || (stage === SendStage.Amount && amount === '')) return true;
    return false;
  }, [amount, stage, toAccount.address]);

  const retryCrossChain = useCallback(
    async ({ transactionId, params }: the2ThFailedActivityItemType) => {
      try {
        if (!chainInfo) return;
        const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
        if (!privateKey) return;
        setLoading(true);
        await intervalCrossChainTransfer({ ...params, chainInfo, privateKey });
        dispatch(removeFailedActivity(transactionId));
      } catch (error) {
        console.log('retry addFailedActivity', error);
        showErrorModal({ transactionId, params });
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, setLoading],
  );
  const showErrorModal = useCallback(
    (error: the2ThFailedActivityItemType) => {
      Modal.error({
        width: 320,
        className: 'transaction-modal',
        okText: t('Resend'),
        icon: null,
        closable: false,
        centered: true,
        title: (
          <div className="flex-column-center transaction-msg">
            <CustomSvg type="warnRed" />
            {t('Transaction failed !')}
          </div>
        ),
        onOk: () => {
          console.log('retry modal addFailedActivity', error);
          retryCrossChain(error);
        },
      });
    },
    [retryCrossChain, t],
  );

  const getTranslationInfo = useCallback(
    async (num = ''): Promise<string | void> => {
      try {
        if (!toAccount?.address) throw 'No toAccount';
        const privateKey = await aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
        if (!privateKey) throw t(WalletError.invalidPrivateKey);
        if (!currentChain) throw 'No ChainInfo';
        const _caAddress = wallet?.[chainId]?.caAddress;
        const feeRes = await getTransferFee({
          caAddress: _caAddress || '',
          managerAddress: wallet.address,
          toAddress: toAccount?.address,
          privateKey,
          chainInfo: currentChain,
          chainType: currentNetwork.walletType,
          token: tokenInfo,
          caHash: wallet.caHash as string,
          amount: timesDecimals(num || amount, tokenInfo.decimals).toFixed(),
        });
        return feeRes;
      } catch (error) {
        const _error = handleErrorMessage(error);
        console.log('getFee===error', _error);
      }
    },
    [amount, chainId, currentChain, currentNetwork.walletType, passwordSeed, t, toAccount?.address, tokenInfo, wallet],
  );

  const sendTransfer = useCallback(async () => {
    try {
      if (!chainInfo || !passwordSeed) return;
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) return;
      if (!tokenInfo) throw 'No Symbol info';

      setLoading(true);

      if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
        await crossChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          managerAddress: wallet.address,
          tokenInfo,
          caHash: wallet?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toFixed(),
          toAddress: toAccount.address,
          fee: timesDecimals(txFee, defaultToken.decimals).toFixed(),
          guardiansApproved: oneTimeApprovalList.current,
        });
      } else {
        console.log('sameChainTransfers==sendHandler');
        await sameChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          tokenInfo,
          caHash: wallet?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toFixed(),
          toAddress: toAccount.address,
          guardiansApproved: oneTimeApprovalList.current,
        });
      }
      message.success('success');
      navigate('/');
    } catch (error: any) {
      setLoading(false);
      if (!error?.type) return message.error(error);
      if (error.type === 'managerTransfer') {
        return message.error(error);
      } else if (error.type === 'crossChainTransfer') {
        dispatch(addFailedActivity(error.data));
        console.log('addFailedActivity', error);

        showErrorModal(error.data);
        return;
      } else {
        message.error(handleErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    chainInfo,
    currentNetwork.walletType,
    defaultToken.decimals,
    dispatch,
    navigate,
    passwordSeed,
    setLoading,
    showErrorModal,
    toAccount.address,
    tokenInfo,
    txFee,
    wallet.AESEncryptPrivateKey,
    wallet.address,
    wallet?.caHash,
  ]);

  const checkLimit = useCheckLimit(tokenInfo.chainId);
  const handleOneTimeApproval = useCallback(() => {
    if (isPrompt) {
      setOpenGuardiansApprove(true);
    } else {
      InternalMessage.payload(
        PortkeyMessageTypes.SEND_TOKEN,
        JSON.stringify({
          pathSuffix: routeData.symbol,
          search: {
            chainId: chainId,
            targetChainId: chainId,
            symbol: routeData.symbol,
            address: tokenInfo.address,
            decimals: routeData.decimals,
            tokenId: tokenInfo.tokenId,
            alias: tokenInfo.alias,
            imageUrl: tokenInfo?.imageUrl,
            stage,
            amount,
            balance,
            toAccount,
            showGuardiansApproveModal: true,
          },
        }),
      ).send();
    }
  }, [
    amount,
    balance,
    chainId,
    isPrompt,
    routeData.decimals,
    routeData.symbol,
    stage,
    toAccount,
    tokenInfo.address,
    tokenInfo.alias,
    tokenInfo?.imageUrl,
    tokenInfo.tokenId,
  ]);
  const onCloseGuardianApprove = useCallback(() => {
    setOpenGuardiansApprove(false);
  }, []);
  const getApproveRes = useCallback(
    async (approveList: GuardianItem[]) => {
      try {
        oneTimeApprovalList.current = approveList;
        if (Array.isArray(approveList) && approveList.length > 0) {
          setOpenGuardiansApprove(false);
          if (stage === SendStage.Amount) {
            setStage(SendStage.Preview);
          } else if (stage === SendStage.Preview) {
            await sendTransfer();
          }
        } else {
          // TODO guardians throw error
        }
      } catch (error) {
        // TODO guardians throw error
      }
    },
    [sendTransfer, stage],
  );

  const checkSecurity = useCheckSecurity();
  const handleCheckPreview = useCallback(async () => {
    try {
      setLoading(true);
      if (!ZERO.plus(amount).toNumber()) return 'Please input amount';
      if (!currentChain) return;
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: tokenInfo.address,
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: wallet?.[chainId]?.caAddress || '',
          symbol: tokenInfo.symbol,
        },
      });
      setBalance(result.result.balance);
      const balance = result.result.balance;
      if (!balance) return TransactionError.TOKEN_NOT_ENOUGH;

      if (type === 'token') {
        // insufficient balance check
        if (timesDecimals(amount, tokenInfo.decimals).isGreaterThan(balance)) {
          return TransactionError.TOKEN_NOT_ENOUGH;
        }
        if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF') && symbol === defaultToken.symbol) {
          if (ZERO.plus(crossChainFee).isGreaterThanOrEqualTo(amount)) {
            return TransactionError.CROSS_NOT_ENOUGH;
          }
        }
      } else if (type === 'nft') {
        if (ZERO.plus(amount).isGreaterThan(balance)) {
          return TransactionError.NFT_NOT_ENOUGH;
        }
      } else {
        return 'input error';
      }

      const _isManagerSynced = await checkManagerSyncState(chainId);
      if (!_isManagerSynced) {
        return 'Synchronizing on-chain account information...';
      }

      // wallet security check
      const securityRes = await checkSecurity(tokenInfo.chainId);
      if (!securityRes) return WalletIsNotSecure;

      // transfer limit check
      const limitRes = await checkLimit({
        chainId: tokenInfo.chainId,
        symbol: tokenInfo.symbol,
        amount: amount,
        decimals: tokenInfo.decimals,
        from: ICheckLimitBusiness.SEND,
        balance,
        extra: {
          stage,
          amount: amount,
          address: tokenInfo.address,
          imageUrl: tokenInfo.imageUrl,
          alias: tokenInfo.alias,
          tokenId: tokenInfo.tokenId,
          toAccount,
        },
        onOneTimeApproval: handleOneTimeApproval,
      });
      if (!limitRes) return ExceedLimit;

      const fee = await getTranslationInfo();
      console.log('---getTranslationInfo', fee);
      if (fee) {
        setTxFee(fee);
      } else {
        return TransactionError.FEE_NOT_ENOUGH;
      }

      return '';
    } catch (error: any) {
      console.log('checkTransactionValue===', error);
      return TransactionError.FEE_NOT_ENOUGH;
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    amount,
    currentChain,
    tokenInfo.address,
    tokenInfo.symbol,
    tokenInfo.chainId,
    tokenInfo.decimals,
    tokenInfo.imageUrl,
    tokenInfo.alias,
    tokenInfo.tokenId,
    currentNetwork.walletType,
    wallet,
    chainId,
    checkManagerSyncState,
    checkSecurity,
    type,
    checkLimit,
    stage,
    toAccount,
    handleOneTimeApproval,
    getTranslationInfo,
    chainInfo?.chainId,
    symbol,
    defaultToken.symbol,
    crossChainFee,
  ]);

  const sendHandler = useCallback(async (): Promise<string | void> => {
    if (!oneTimeApprovalList.current || oneTimeApprovalList.current.length === 0) {
      if (!tokenInfo) throw 'No Symbol info';
      setLoading(true);
      try {
        // transfer limit check
        const limitRes = await checkLimit({
          chainId: tokenInfo.chainId,
          symbol: tokenInfo.symbol,
          amount: amount,
          decimals: tokenInfo.decimals,
          from: ICheckLimitBusiness.SEND,
          balance,
          extra: {
            stage,
            amount: amount,
            address: tokenInfo.address,
            imageUrl: tokenInfo.imageUrl,
            alias: tokenInfo.alias,
            tokenId: tokenInfo.tokenId,
            toAccount,
          },
          onOneTimeApproval: handleOneTimeApproval,
        });
        if (!limitRes) {
          setLoading(false);
          return ExceedLimit;
        }
      } catch (error) {
        setLoading(false);

        const msg = handleErrorMessage(error);
        message.error(msg);
        return;
      }
    }
    await sendTransfer();
  }, [amount, balance, checkLimit, handleOneTimeApproval, sendTransfer, setLoading, stage, toAccount, tokenInfo]);

  const StageObj: TypeStageObj = useMemo(
    () => ({
      0: {
        btnText: 'Next',
        handler: (): any => {
          const res = validateToAddress(toAccount);

          if (!res) return;
          if (!toAccount) return;
          if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
            return Modal.confirm({
              width: 320,
              content: t('This is a cross-chain transaction.'),
              className: 'cross-modal delete-modal',
              autoFocusButton: null,
              icon: null,
              centered: true,
              okText: t('Continue'),
              cancelText: t('Cancel'),
              onOk: () => setStage(SendStage.Amount),
            });
          }

          setStage(SendStage.Amount);
        },
        backFun: () => {
          navigate(-1);
        },
        element: (
          <AddressSelector
            onClick={(account: IClickAddressProps) => {
              // from RecentList: Not recent contacts, not clickable
              if (account.isDisable) return;
              const value = {
                name: account.name,
                address: `ELF_${account.address}_${account?.addressChainId || account?.chainId}`,
              };
              setToAccount(value);
            }}
            chainId={tokenInfo.chainId}
          />
        ),
      },
      1: {
        btnText: 'Preview',
        handler: async () => {
          const res = await handleCheckPreview();
          if (res === ExceedLimit || res === WalletIsNotSecure) return;
          if (!res) {
            setTipMsg('');
            setStage(SendStage.Preview);
          } else {
            setTipMsg(res);
          }
        },
        backFun: () => {
          setStage(SendStage.Address);
          setAmount('');
          setTipMsg('');
          oneTimeApprovalList.current = [];
        },
        element: (
          <AmountInput
            type={type as any}
            fromAccount={{
              address: wallet?.[chainId]?.caAddress || '',
              AESEncryptPrivateKey: wallet.AESEncryptPrivateKey,
            }}
            toAccount={{
              address: toAccount.address,
            }}
            value={amount}
            errorMsg={tipMsg}
            token={tokenInfo as BaseToken}
            onChange={({ amount, balance }) => {
              setAmount(amount);
              setBalance(balance);
            }}
            getTranslationInfo={getTranslationInfo}
            setErrorMsg={setTipMsg}
          />
        ),
      },
      2: {
        btnText: 'Send',
        handler: () => {
          sendHandler();
        },
        backFun: () => {
          setStage(SendStage.Amount);
          oneTimeApprovalList.current = [];
        },
        element: (
          <SendPreview
            type={type as 'token' | 'nft'}
            toAccount={{
              ...toAccount,
              address: getEntireDIDAelfAddress(toAccount.address, undefined, chainInfo?.chainId ?? 'AELF'),
            }}
            amount={amount}
            symbol={tokenInfo?.symbol || ''}
            alias={tokenInfo.alias || ''}
            imageUrl={tokenInfo.imageUrl || ''}
            chainId={chainId}
            transactionFee={txFee || ''}
            isCross={isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')}
            tokenId={tokenInfo.tokenId || ''}
          />
        ),
      },
    }),
    [
      tokenInfo,
      type,
      wallet,
      chainId,
      toAccount,
      amount,
      tipMsg,
      getTranslationInfo,
      chainInfo?.chainId,
      txFee,
      validateToAddress,
      t,
      navigate,
      handleCheckPreview,
      sendHandler,
    ],
  );

  const showSideChainModal = useCallback(() => {
    const modal = CustomModal({
      className: 'side-chain-modal',
      content: (
        <div>
          <div className="modal-title">{SideChainTipTitle}</div>
          <div>{SideChainTipContent}</div>
        </div>
      ),
      okText: 'Got it',
      onOk: () => modal.destroy(),
    });
  }, []);

  const renderSideChainTip = useCallback(() => {
    return (
      chainId !== MAIN_CHAIN_ID && (
        <div className="flex-row-between side-chain-tip" onClick={showSideChainModal}>
          <div className="flex">
            <CustomSvg type="Info" />
            <div>{SideChainTipTitle}</div>
          </div>
          <CustomSvg type="LeftArrow" />
        </div>
      )
    );
  }, [chainId, showSideChainModal]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['page-send', isPrompt && 'detail-page-prompt'])}>
        <TitleWrapper
          className="page-title"
          title={`Send ${type === 'token' ? symbol : ''}`}
          leftCallBack={() => {
            StageObj[stage].backFun();
          }}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/')} />}
        />
        {stage !== SendStage.Preview && (
          <div className={clsx(['address-form', chainId !== MAIN_CHAIN_ID && 'address-form-side-chain'])}>
            <div className="address-wrap">
              <div className="item from">
                <span className="label">{t('From_with_colon')}</span>
                <div className={'from-wallet control'}>
                  <div className="name">{walletName}</div>
                </div>
              </div>
              <div className="item to">
                <span className="label">{t('To_with_colon')}</span>
                <div className="control">
                  <ToAccount value={toAccount} onChange={(v) => setToAccount(v)} focus={stage !== SendStage.Amount} />
                  {toAccount.address && (
                    <CustomSvg
                      type="Close2"
                      onClick={() => {
                        setStage(SendStage.Address);
                        setToAccount({ address: '' });
                      }}
                    />
                  )}
                </div>
              </div>
              {errorMsg && <span className="error-msg">{errorMsg}</span>}
            </div>
            {renderSideChainTip()}
          </div>
        )}
        <div className="stage-ele">{StageObj[stage].element}</div>
        <div className="btn-wrap">
          <Button disabled={btnDisabled} className="stage-btn" type="primary" onClick={StageObj[stage].handler}>
            {StageObj[stage].btnText}
          </Button>
        </div>

        <GuardianApproveModal
          open={openGuardiansApprove}
          targetChainId={tokenInfo.chainId}
          operationType={OperationTypeEnum.transferApprove}
          onClose={onCloseGuardianApprove}
          getApproveRes={getApproveRes}
        />

        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [
    StageObj,
    btnDisabled,
    chainId,
    errorMsg,
    getApproveRes,
    isPrompt,
    navigate,
    onCloseGuardianApprove,
    openGuardiansApprove,
    renderSideChainTip,
    stage,
    symbol,
    t,
    toAccount,
    tokenInfo.chainId,
    type,
    walletName,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
