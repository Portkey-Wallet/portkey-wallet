import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentUserInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getAddressChainId, handleErrorMessage, isDIDAddress } from '@portkey-wallet/utils';
import { getAelfAddress, getEntireDIDAelfAddress, isCrossChain, isEqAddress } from '@portkey-wallet/utils/aelf';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { Button, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useCommonState, useLoading } from 'store/Provider/hooks';
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
import {
  SEND_SIDE_CHAIN_TOKEN_TIP_CONTENT,
  SEND_SIDE_CHAIN_TOKEN_TIP_TITLE,
} from '@portkey-wallet/constants/constants-ca/send';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams } from 'hooks/router';
import { TSendLocationState, TSendPageType } from 'types/router';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { useExtensionETransShow } from 'hooks/cms';
import { checkIsValidEtransferAddress } from '@portkey-wallet/utils/check';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { getDisclaimerData } from 'utils/disclaimer';
import { TradeTypeEnum } from 'constants/trade';
import { useCrossTransferByEtransfer } from 'hooks/useCrossTransferByEtransfer';
import { CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL } from '@portkey-wallet/utils/withdraw';
import { TWithdrawInfo } from '@etransfer/services';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { COMMON_PRIVATE } from '@portkey-wallet/constants';

export type ToAccount = { address: string; name?: string };

export enum SendStage {
  'Address',
  'Amount',
  'Preview',
}

type TypeStageObj = {
  [key in SendStage]: { btnText: string; handler: () => void; backFun: () => void; element: ReactElement };
};

export default function Send() {
  const navigate = useNavigate();
  const userInfo = useCurrentUserInfo();
  // TODO need get data from state and wait for BE data structure
  const { type, symbol } = useParams();
  const { locationParams: state } = usePromptLocationParams<TSendLocationState, TSendLocationState>();
  const { isPrompt } = useCommonState();
  const chainId: ChainId = useMemo(() => state.targetChainId || state.chainId, [state.chainId, state.targetChainId]);
  const chainInfo = useCurrentChain(chainId);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [openGuardiansApprove, setOpenGuardiansApprove] = useState<boolean>(!!state?.openGuardiansApprove);
  const oneTimeApprovalList = useRef<GuardianItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [tipMsg, setTipMsg] = useState('');
  const [toAccount, setToAccount] = useState<ToAccount>(state?.toAccount || { address: '' });
  const [stage, setStage] = useState<SendStage>(state?.stage || SendStage.Address);
  const [amount, setAmount] = useState(state?.amount || '');
  const [balance, setBalance] = useState(state?.balance || '');
  const isValidSuffix = useIsValidSuffix();
  const checkManagerSyncState = useCheckManagerSyncState();
  const [txFee, setTxFee] = useState<string>();
  const [withdrawInfo, setWithdrawInfo] = useState<TWithdrawInfo>();

  const currentChain = useCurrentChain(chainId);
  const { checkDappIsConfirmed } = useDisclaimer();
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);

  const { withdraw, withdrawPreview } = useCrossTransferByEtransfer();

  const dappShowFn = useMemo(
    () => checkEnabledFunctionalTypes(state.symbol, state.chainId === MAIN_CHAIN_ID),
    [state.chainId, state.symbol],
  );
  const { isETransWithdrawShow } = useExtensionETransShow();
  const isSideChainSend = useMemo(() => state.chainId !== MAIN_CHAIN_ID, [state.chainId]);

  useFetchTxFee();

  const tokenInfo: BaseToken = useMemo(
    () => ({
      chainId: chainId,
      decimals: state.decimals, // 8
      address: state.address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        state address  contract address
      symbol: state.symbol, // "ELF"   the name showed
      name: state.symbol,
      imageUrl: state.imageUrl,
      alias: state.alias,
      tokenId: state.tokenId,
      isSeed: state.isSeed,
      seedType: state.seedType,
      label: state.label,
    }),
    [
      chainId,
      state.address,
      state.alias,
      state.decimals,
      state.imageUrl,
      state.isSeed,
      state.seedType,
      state.symbol,
      state.tokenId,
      state.label,
    ],
  );
  const defaultToken = useDefaultToken(chainId);

  const validateToAddress = useCallback(
    (value: { name?: string; address: string } | undefined, showError = true) => {
      if (!value) return false;
      const suffix = getAddressChainId(toAccount.address, chainInfo?.chainId || 'AELF');
      if (!isDIDAddress(value.address) || !isValidSuffix(suffix)) {
        showError && setErrorMsg(AddressCheckError.recipientAddressIsInvalid);
        return false;
      }
      const selfAddress = wallet?.[chainId]?.caAddress || '';
      if (isEqAddress(selfAddress, getAelfAddress(toAccount.address)) && suffix === chainId) {
        showError && setErrorMsg(AddressCheckError.equalIsValid);
        return false;
      }
      showError && setErrorMsg('');
      return true;
    },
    [chainId, chainInfo?.chainId, isValidSuffix, toAccount.address, wallet],
  );

  const isShowWithdrawTip = useMemo(
    () =>
      dappShowFn.withdraw &&
      isETransWithdrawShow &&
      !validateToAddress(toAccount, false) &&
      checkIsValidEtransferAddress(toAccount.address),
    [dappShowFn.withdraw, isETransWithdrawShow, toAccount, validateToAddress],
  );

  const btnDisabled = useMemo(() => {
    if (toAccount.address === '' || (stage === SendStage.Amount && amount === '')) return true;
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
        console.log('getFee===error', error);
      }
    },
    [amount, chainId, currentChain, currentNetwork.walletType, t, toAccount?.address, tokenInfo, wallet],
  );

  const sendTransfer = useCallback(async () => {
    try {
      setLoading(true);

      const { privateKey } = await getSeed();
      if (!chainInfo || !privateKey) return;
      if (!tokenInfo) throw 'No Symbol info';

      if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
        const crossParams = {
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
        };

        const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo?.maxAmount) : true;
        const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo?.minAmount) : true;
        const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

        if (CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(crossParams.tokenInfo.symbol) && amountAllowed) {
          await withdraw({
            chainId,
            toAddress: crossParams.toAddress,
            amount,
            tokenInfo,
          });
        } else {
          await crossChainTransfer(crossParams);
        }
      } else {
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
      singleMessage.success('success');
      navigate('/');
    } catch (error: any) {
      setLoading(false);
      if (error && error.type === 'crossChainTransfer') {
        dispatch(addFailedActivity(error.data));
        console.log('addFailedActivity', error);

        showErrorModal(error.data);
        return;
      } else {
        singleMessage.error(handleErrorMessage(error, 'Transfer Failed'));
      }
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    chainId,
    chainInfo,
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
    withdraw,
    withdrawInfo,
  ]);

  const { crossChain: crossChainFee, etransfer: etransferFee } = useGetTxFee(chainId);

  const getEtransferCAAllowance = useCallback(
    async (token: BaseToken) => {
      if (!currentChain) throw 'No currentChain';

      const tokenContract = new ExtensionContractBasic({
        rpcUrl: currentChain.endPoint,
        contractAddress: currentChain.defaultToken.address,
        privateKey: COMMON_PRIVATE,
      });
      const allowanceRes = await tokenContract.callViewMethod('GetAllowance', {
        symbol: token.symbol,
        owner: wallet[chainId]?.caAddress,
        spender: currentNetwork.eTransferCA?.[token.chainId],
      });

      if (allowanceRes?.error) throw allowanceRes?.error;
      const allowance = divDecimals(allowanceRes.data.allowance ?? allowanceRes.data.amount ?? 0, token.decimals);
      return allowance;
    },
    [chainId, currentChain, currentNetwork.eTransferCA, wallet],
  );

  const getEtransferMaxFee = useCallback(
    // approve fee
    async ({ amount }: { amount: string }) => {
      const token = tokenInfo;
      try {
        const [{ withdrawInfo }, allowance] = await Promise.all([
          withdrawPreview({
            chainId: token.chainId,
            address: toAccount.address,
            symbol: token.symbol,
          }),
          getEtransferCAAllowance(token),
        ]);

        console.log(withdrawInfo, allowance, 'checkEtransferMaxFee==');

        let _etransferFee = etransferFee;

        const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo.maxAmount) : true;
        const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo.minAmount) : true;
        const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

        if (amountAllowed && allowance.gte(amount)) _etransferFee = 0;
        console.log(_etransferFee, '_etransferFee==checkEtransferMaxFee');
        return _etransferFee.toString();
      } catch (error) {
        console.error('checkEtransferMaxFee:', error);
        return etransferFee.toString();
      }
    },
    [tokenInfo, withdrawPreview, toAccount.address, getEtransferCAAllowance, etransferFee],
  );

  const checkLimit = useCheckLimit(tokenInfo.chainId);
  const handleOneTimeApproval = useCallback(() => {
    if (isPrompt) return setOpenGuardiansApprove(true);

    const params: TSendLocationState = {
      ...tokenInfo,
      targetChainId: chainId,
      toAccount,
      stage,
      amount,
      balance,
      type: type as TSendPageType,
      openGuardiansApprove: true,
    };
    InternalMessage.payload(PortkeyMessageTypes.SEND, JSON.stringify(params)).send();
  }, [amount, balance, chainId, isPrompt, stage, toAccount, tokenInfo, type]);

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
          throw Error('approve failed, please try again');
        }
      } catch (error) {
        throw Error('approve failed, please try again');
      }
    },
    [sendTransfer, stage],
  );

  const checkSecurity = useCheckSecurity();
  const handleCheckPreview = useCallback(async () => {
    try {
      setLoading(true);
      if (!ZERO.plus(amount).toNumber()) return 'Please input amount';
      if (!currentChain) return 'currentChain is not exist';
      const tokenSymbol = tokenInfo.symbol;
      console.log(tokenInfo, 'tokenInfo===handleCheckPreview');
      const caAddress = wallet?.[chainId]?.caAddress || '';
      // CHECK 1: manager sync
      const _isManagerSynced = await checkManagerSyncState(chainId);
      if (!_isManagerSynced) {
        return 'Synchronizing on-chain account information...';
      }

      // CHECK 2: wallet security
      const securityRes = await checkSecurity(tokenInfo.chainId);
      if (!securityRes) return WalletIsNotSecure;

      // CHECK 3: balance
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: tokenInfo.address,
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: caAddress,
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

      // CHECK 4: transfer limit
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
      // CHECK 5: tx fee
      if (
        isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF') &&
        CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenSymbol)
      ) {
        try {
          const [{ withdrawInfo }, allowance] = await Promise.all([
            withdrawPreview({
              chainId,
              address: toAccount.address,
              symbol: tokenSymbol,
              amount,
            }),
            getEtransferCAAllowance(tokenInfo),
          ]);

          let _etransferFee = etransferFee;

          const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo.maxAmount) : true;
          const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo.minAmount) : true;

          const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

          if ((amountAllowed && allowance.gte(amount)) || tokenSymbol !== defaultToken.symbol) _etransferFee = 0;

          if (ZERO.plus(amount).plus(_etransferFee).gt(divDecimals(balance, tokenInfo.decimals)))
            return TransactionError.TOKEN_NOT_ENOUGH;

          if (amountAllowed) {
            setTxFee(withdrawInfo.aelfTransactionFee);
            setWithdrawInfo(withdrawInfo);
            return '';
          }
        } catch (error) {
          console.error(handleErrorMessage(error));
        }
      }
      const fee = await getTranslationInfo();
      console.log('---getTranslationInfo', fee);
      setWithdrawInfo(undefined);

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
    tokenInfo,
    wallet,
    chainId,
    checkManagerSyncState,
    checkSecurity,
    currentNetwork.walletType,
    type,
    checkLimit,
    stage,
    toAccount,
    handleOneTimeApproval,
    chainInfo?.chainId,
    getTranslationInfo,
    symbol,
    defaultToken.symbol,
    crossChainFee,
    withdrawPreview,
    getEtransferCAAllowance,
    etransferFee,
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
        singleMessage.error(msg);
        return;
      }
    }
    await sendTransfer();
  }, [amount, balance, checkLimit, handleOneTimeApproval, sendTransfer, setLoading, stage, toAccount, tokenInfo]);

  const checkSideChainSendModal = useCallback(() => {
    const modal = CustomModal({
      type: 'confirm',
      className: 'side-chain-modal',
      content: (
        <div>
          <div className="modal-title">{SEND_SIDE_CHAIN_TOKEN_TIP_TITLE}</div>
          <div>
            {SEND_SIDE_CHAIN_TOKEN_TIP_CONTENT.map((item, i) => (
              <div key={`send_modal_${i}`}>{item}</div>
            ))}
          </div>
        </div>
      ),
      okText: 'Confirm',
      onOk: () => {
        modal.destroy();
        sendHandler();
      },
    });
  }, [sendHandler]);

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
              setTipMsg('');
            }}
            getTranslationInfo={getTranslationInfo}
            getEtransferwithdrawInfo={getEtransferMaxFee}
            setErrorMsg={setTipMsg}
          />
        ),
      },
      2: {
        btnText: 'Send',
        handler: () => {
          if (isSideChainSend) {
            checkSideChainSendModal();
          } else {
            sendHandler();
          }
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
            receiveAmount={withdrawInfo?.receiveAmount}
            receiveAmountUsd={withdrawInfo?.receiveAmountUsd}
            crossChainFee={withdrawInfo?.transactionFee || crossChainFee}
            crossChainFeeUnit={withdrawInfo?.transactionUnit}
            isCross={isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')}
            tokenId={tokenInfo.tokenId || ''}
            isSeed={state.isSeed}
            seedType={state.seedType}
            decimals={tokenInfo.decimals}
            label={state.label}
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
      getEtransferMaxFee,
      chainInfo?.chainId,
      txFee,
      withdrawInfo?.receiveAmount,
      withdrawInfo?.receiveAmountUsd,
      withdrawInfo?.transactionFee,
      withdrawInfo?.transactionUnit,
      crossChainFee,
      state.isSeed,
      state.seedType,
      state.label,
      validateToAddress,
      t,
      navigate,
      handleCheckPreview,
      isSideChainSend,
      checkSideChainSendModal,
      sendHandler,
    ],
  );

  const showSideChainModal = useCallback(() => {
    const modal = CustomModal({
      className: 'side-chain-modal',
      content: (
        <div>
          <div className="modal-title">{SEND_SIDE_CHAIN_TOKEN_TIP_TITLE}</div>
          <div>
            {SEND_SIDE_CHAIN_TOKEN_TIP_CONTENT.map((item, i) => (
              <div key={`send_${i}`}>{item}</div>
            ))}
          </div>
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
            <div>{SEND_SIDE_CHAIN_TOKEN_TIP_TITLE}</div>
          </div>
          <CustomSvg type="LeftArrow" />
        </div>
      )
    );
  }, [showSideChainModal, state.chainId]);

  const goToWithDraw = useCallback(() => {
    const originUrl = currentNetwork.eTransferUrl ?? '';
    const targetUrl = stringifyETrans({
      url: currentNetwork.eTransferUrl || '',
      query: {
        type: 'Withdraw',
        tokenSymbol: state.symbol,
        chainId: state.chainId,
        withdrawAddress: toAccount.address,
      },
    });

    if (checkDappIsConfirmed(originUrl)) {
      const openWinder = window.open(targetUrl, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
    } else {
      disclaimerData.current = getDisclaimerData({ type: TradeTypeEnum.ETrans, originUrl, targetUrl });
      setDisclaimerOpen(true);
    }
  }, [checkDappIsConfirmed, currentNetwork.eTransferUrl, state.chainId, state.symbol, toAccount.address]);

  const renderWithdrawTip = useCallback(() => {
    return (
      <div className="flex etransfer-withdraw-tip">
        <CustomSvg type="InfoNew" className="flex-1" />
        <div className="tip-content">
          {`The To address is not on the aelf network. If you intend to send assets cross-chain, please try using `}
          <span onClick={goToWithDraw} className="tip-click-content">
            ETransfer
          </span>
          {`.`}
        </div>
      </div>
    );
  }, [goToWithDraw]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['page-send', isPrompt && 'detail-page-prompt'])}>
        <CommonHeader
          title={`Send ${type === 'token' ? tokenInfo.label ?? symbol : ''}`}
          onLeftBack={() => {
            StageObj[stage].backFun();
          }}
          rightElementList={[
            {
              customSvgType: 'SuggestClose',
              onClick: () => navigate('/'),
            },
          ]}
        />
        {stage !== SendStage.Preview && (
          <div
            className={clsx([
              'address-form',
              state.chainId !== MAIN_CHAIN_ID && 'address-form-side-chain',
              isShowWithdrawTip && 'etransfer-withdraw-tip-wrap',
            ])}>
            <div className="address-wrap">
              <div className="item from">
                <span className="label">{t('From_with_colon')}</span>
                <div className={'from-wallet control'}>
                  <div className="name">{userInfo?.nickName}</div>
                </div>
              </div>
              <div className="item to">
                <span className="label">{t('To_with_colon')}</span>
                <div className="control">
                  <ToAccount
                    value={toAccount}
                    onChange={(v) => {
                      setErrorMsg('');
                      setToAccount(v);
                    }}
                    focus={stage !== SendStage.Amount}
                  />
                  {toAccount.address && (
                    <CustomSvg
                      type="SuggestClose"
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
            {!isShowWithdrawTip && renderSideChainTip()}
          </div>
        )}
        {isShowWithdrawTip && renderWithdrawTip()}
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
        <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />

        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [
    StageObj,
    btnDisabled,
    disclaimerOpen,
    errorMsg,
    getApproveRes,
    isPrompt,
    isShowWithdrawTip,
    navigate,
    onCloseGuardianApprove,
    openGuardiansApprove,
    renderSideChainTip,
    renderWithdrawTip,
    stage,
    state.chainId,
    symbol,
    t,
    toAccount,
    tokenInfo.chainId,
    tokenInfo.label,
    type,
    userInfo?.nickName,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
