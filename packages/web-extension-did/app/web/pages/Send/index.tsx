import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getAddressChainId, handleErrorMessage, isDIDAddress } from '@portkey-wallet/utils';
import { getAelfAddress, getEntireDIDAelfAddress, isCrossChain, isEqAddress } from '@portkey-wallet/utils/aelf';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { Button, message, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAppDispatch, useCommonState, useLoading, useWalletInfo } from 'store/Provider/hooks';
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
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import CustomModal from 'pages/components/CustomModal';
import { SideChainTipContent, SideChainTipTitle } from '@portkey-wallet/constants/constants-ca/send';
import getSeed from 'utils/getSeed';

export type Account = { address: string; name?: string };

enum Stage {
  'Address',
  'Amount',
  'Preview',
}

type TypeStageObj = {
  [key in Stage]: { btnText: string; handler: () => void; backFun: () => void; element: ReactElement };
};

export default function Send() {
  const navigate = useNavigate();
  const { walletName } = useWalletInfo();
  // TODO need get data from state and wait for BE data structure
  const { type, symbol } = useParams();
  const { state } = useLocation();
  const chainInfo = useCurrentChain(state.chainId);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [tipMsg, setTipMsg] = useState('');
  const [toAccount, setToAccount] = useState<{ name?: string; address: string }>({ address: '' });
  const [stage, setStage] = useState<Stage>(Stage.Address);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const isValidSuffix = useIsValidSuffix();
  const checkManagerSyncState = useCheckManagerSyncState();
  const [txFee, setTxFee] = useState<string>();
  const currentChain = useCurrentChain(state.chainId);
  useFetchTxFee();
  const { crossChain: crossChainFee } = useGetTxFee(state.chainId);
  const tokenInfo = useMemo(
    () => ({
      chainId: state.chainId,
      decimals: state.decimals, // 8
      address: state.address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        state address  contract address
      symbol: state.symbol, // "ELF"   the name showed
      name: state.symbol,
      imageUrl: state.imageUrl,
      alias: state.alias,
      tokenId: state.tokenId,
    }),
    [state],
  );
  const defaultToken = useDefaultToken(state.chainId as ChainId);

  const validateToAddress = useCallback(
    (value: { name?: string; address: string } | undefined) => {
      if (!value) return false;
      const suffix = getAddressChainId(toAccount.address, chainInfo?.chainId || 'AELF');
      if (!isDIDAddress(value.address) || !isValidSuffix(suffix)) {
        setErrorMsg(AddressCheckError.recipientAddressIsInvalid);
        return false;
      }
      const selfAddress = wallet?.[state.chainId as ChainId]?.caAddress || '';
      if (isEqAddress(selfAddress, getAelfAddress(toAccount.address)) && suffix === state.chainId) {
        setErrorMsg(AddressCheckError.equalIsValid);
        return false;
      }
      setErrorMsg('');
      return true;
    },
    [chainInfo, isValidSuffix, state.chainId, toAccount.address, wallet],
  );

  const btnDisabled = useMemo(() => {
    if (toAccount.address === '' || (stage === Stage.Amount && amount === '')) return true;
    return false;
  }, [amount, stage, toAccount.address]);

  const retryCrossChain = useCallback(
    async ({ transactionId, params }: the2ThFailedActivityItemType) => {
      try {
        if (!chainInfo) return;
        const { privateKey } = await getSeed();
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
        const { privateKey } = await getSeed();
        if (!privateKey) throw t(WalletError.invalidPrivateKey);
        if (!currentChain) throw 'No ChainInfo';
        const _caAddress = wallet?.[(state.chainId as ChainId) || defaultToken.symbol]?.caAddress;
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
        console.log('getFee===error', error);
      }
    },
    [
      amount,
      currentChain,
      currentNetwork.walletType,
      defaultToken.symbol,
      state.chainId,
      t,
      toAccount?.address,
      tokenInfo,
      wallet,
    ],
  );

  const checkLimit = useCheckLimit(tokenInfo.chainId);

  const checkSecurity = useCheckSecurity();
  const handleCheckPreview = useCallback(async () => {
    try {
      setLoading(true);
      if (!ZERO.plus(amount).toNumber()) return 'Please input amount';
      if (!balance) return TransactionError.TOKEN_NOT_ENOUGH;

      const _isManagerSynced = await checkManagerSyncState(state.chainId);
      if (!_isManagerSynced) {
        return 'Synchronizing on-chain account information...';
      }

      // wallet security check
      const securityRes = await checkSecurity(tokenInfo.chainId);
      if (!securityRes) return WalletIsNotSecure;

      // transfer limit check
      const res = await checkLimit({
        chainId: tokenInfo.chainId,
        symbol: tokenInfo.symbol,
        amount: amount,
        decimals: tokenInfo.decimals,
        from: ICheckLimitBusiness.SEND,
      });
      if (typeof res !== 'boolean') return ExceedLimit;

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
    checkManagerSyncState,
    state.chainId,
    type,
    getTranslationInfo,
    checkSecurity,
    tokenInfo.chainId,
    tokenInfo.symbol,
    tokenInfo.decimals,
    checkLimit,
    balance,
    toAccount.address,
    chainInfo?.chainId,
    symbol,
    defaultToken.symbol,
    crossChainFee,
  ]);

  const sendHandler = useCallback(async () => {
    try {
      const { privateKey } = await getSeed();
      if (!chainInfo || !privateKey) return;
      if (!tokenInfo) throw 'No Symbol info';
      setLoading(true);
      try {
        // transfer limit check
        const res = await checkLimit({
          chainId: tokenInfo.chainId,
          symbol: tokenInfo.symbol,
          amount: amount,
          decimals: tokenInfo.decimals,
          from: ICheckLimitBusiness.SEND,
        });
        if (typeof res !== 'boolean') {
          setLoading(false);
          return ExceedLimit;
        }
      } catch (error) {
        setLoading(false);

        const msg = handleErrorMessage(error);
        message.error(msg);
      }

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
        });
      }
      message.success('success');
      navigate('/');
    } catch (error: any) {
      console.log('sendHandler==error', error);
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
    checkLimit,
    currentNetwork.walletType,
    defaultToken.decimals,
    dispatch,
    navigate,
    setLoading,
    showErrorModal,
    toAccount.address,
    tokenInfo,
    txFee,
    wallet.address,
    wallet?.caHash,
  ]);

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
              onOk: () => setStage(Stage.Amount),
            });
          }

          setStage(Stage.Amount);
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
            setStage(Stage.Preview);
          } else {
            setTipMsg(res);
          }
        },
        backFun: () => {
          setStage(Stage.Address);
          setAmount('');
          setTipMsg('');
        },
        element: (
          <AmountInput
            type={type as any}
            fromAccount={{
              address: wallet?.[state.chainId as ChainId]?.caAddress || '',
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
          setStage(Stage.Amount);
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
            imageUrl={tokenInfo.imageUrl}
            chainId={state.chainId}
            transactionFee={txFee || ''}
            isCross={isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')}
            tokenId={tokenInfo.tokenId || ''}
          />
        ),
      },
    }),
    [
      type,
      wallet,
      state.chainId,
      toAccount,
      amount,
      tipMsg,
      tokenInfo,
      getTranslationInfo,
      txFee,
      chainInfo?.chainId,
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
      state.chainId !== MAIN_CHAIN_ID && (
        <div className="flex-row-between side-chain-tip" onClick={showSideChainModal}>
          <div className="flex">
            <CustomSvg type="Info" />
            <div>{SideChainTipTitle}</div>
          </div>
          <CustomSvg type="LeftArrow" />
        </div>
      )
    );
  }, [showSideChainModal, state.chainId]);

  const { isPrompt } = useCommonState();
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
        {stage !== Stage.Preview && (
          <div className={clsx(['address-form', state.chainId !== MAIN_CHAIN_ID && 'address-form-side-chain'])}>
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
                  <ToAccount value={toAccount} onChange={(v) => setToAccount(v)} focus={stage !== Stage.Amount} />
                  {toAccount.address && (
                    <CustomSvg
                      type="Close2"
                      onClick={() => {
                        setStage(Stage.Address);
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
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [
    StageObj,
    btnDisabled,
    errorMsg,
    isPrompt,
    navigate,
    renderSideChainTip,
    stage,
    state.chainId,
    symbol,
    t,
    toAccount,
    type,
    walletName,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
