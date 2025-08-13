import { useCurrentChain, useCurrentChainList, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import {
  addressFormat,
  formatStr2EllipsisStr,
  getAddressChainId,
  getChainIdByAddress,
  handleErrorMessage,
} from '@portkey-wallet/utils';
import { getEntireDIDAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { divDecimals, formatAmountShow, timesDecimals } from '@portkey-wallet/utils/converter';
import CommonHeader from 'components/CommonHeader';
import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import crossChainTransfer from 'utils/sandboxUtil/crossChainTransfer';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import AddressSelector from './components/AddressSelector';
import SendPreview from './components/SendPreview';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import clsx from 'clsx';
import { IAssetToken, INftInfoType } from '@portkey-wallet/store/store-eoa/assets/type';
import { ChainId } from '@portkey-wallet/types';
import './index.less';
import { GuardianItem } from 'types/guardians';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { SEND_HELP_URL, TransactionError, WarningKey } from '@portkey-wallet/constants/constants-eoa/send';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams } from 'hooks/router';
import { TSendLocationState } from 'types/router';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { useCrossTransferByEtransfer } from 'hooks/useCrossTransferByEtransfer';
import { CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL } from '@portkey-wallet/utils/withdrawEOA';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { COMMON_PRIVATE } from '@portkey-wallet/constants';
import ToAddressInput, { IToAddressInputRef } from './components/ToAddressInput';
import SelectNetwork, { INetworkItem } from './components/SelectNetwork';
import AddressTypeSelect, { AddressTypeEnum, ExchangeTypeShow } from './components/AddressTypeSelect';
import { CommonButton, CommonPromptCard } from '@portkey/did-ui-react';
import SendModalTip, { ButtonGroupType, ButtonType } from './components/SendModalTip';
import { getLimitTips, getSendNetworkList, getSmallerValue, isValidAmount } from './utils';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import useGetEBridgeConfig from 'hooks/ebridge';
import Completed from './components/Completed';
import TokenBalanceShow from 'pages/components/TokenBalanceShow';
import NFTBalanceShow from 'pages/components/NFTBalanceShow';
import NFTInput from './components/AmountInputNFT';
import TokenInput from './components/AmountInputToken';
import { usePin } from 'hooks/usePin';
import { CrossEBridgeExtension } from 'utils/sandboxUtil/extension-cross-chain';
import { useRecent } from '@portkey-wallet/hooks/hooks-eoa/recent';
import { TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { useGetTransferFee } from 'hooks/transfer';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCurrentNetwork, useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';

export enum SendPageTypeEnum {
  token = 'token',
  nft = 'nft',
}

export type ToAccount = { address: string; name?: string };

export enum SendStage {
  Address = 'Address',
  Amount = 'Amount',
  Preview = 'Preview',
  Completed = 'Completed',
}

export enum ModalTipKeyEnum {
  dAppChainToExchange = 'dAppChainToExchange',
  eBridge = 'eBridge',
  unSupportedAsset = 'unSupportedAsset',
  crossChain = 'crossChain',
}

// TODO-SA
export enum PromptCardType {
  LOADING = 'loading',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export const AdsCheckWarningTip = {
  [WarningKey.INVALID_ADDRESS]: {
    type: PromptCardType.ERROR,
    desc: `You can't send assets to this address because it's not a valid address, or is not supported at the moment.`,
  },
  [WarningKey.CROSS_CHAIN]: {
    type: PromptCardType.WARNING,
    desc: `This is a cross-chain transfer. Sending will incur transfer fees.`,
  },
  [WarningKey.SAME_ADDRESS]: {
    type: PromptCardType.ERROR,
    desc: `You can't send to this address because it's the same as the sending address.`,
  },
  [WarningKey.STRANGE_ADDRESS]: {
    type: PromptCardType.WARNING,
    desc: `You have not used this address recently. Ensure it is the correct address before proceeding.`,
  },
  [WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]: {
    type: PromptCardType.WARNING,
    desc: `The address you've entered appears to be for an exchange. Please confirm before proceeding. Sending tokens to the wrong address may result in the loss of your assets.`,
  },
  [WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]: {
    type: PromptCardType.WARNING,
    desc: `The address entered seems to be for an exchange. Please confirm if it's one of the supported ones before continuing to avoid losing your asset.`,
  },
  [WarningKey.MAKE_SURE_SUPPORT_PLATFORM]: {
    type: PromptCardType.INFO,
    desc: `Make sure that your receiving platform supports the token and network.`,
  },
};

type TypeStageObj = {
  [key in SendStage]: {
    headerText: string;
    btnText: string;
    handler: () => void;
    backFun: () => void;
    element: ReactElement;
  };
};

export default function Send() {
  const navigate = useNavigate();
  const { type, symbol } = useParams();
  const { locationParams: state } = usePromptLocationParams<TSendLocationState, TSendLocationState>();
  const chainId: ChainId = useMemo(() => state.targetChainId || state.chainId, [state.chainId, state.targetChainId]);

  const { addRecent, checkAddressIsRecent } = useRecent();
  const toAddressInputRef = useRef<IToAddressInputRef>();

  const tokenInfo: BaseToken = useMemo(() => {
    if (type === SendPageTypeEnum.token) {
      const _asset = state as IAssetToken;
      return {
        chainId: chainId,
        decimals: _asset.decimals,
        address: _asset.tokenContractAddress || '', // contract address
        symbol: _asset.symbol,
        name: _asset.symbol,
        label: _asset.label,
        imageUrl: _asset.imageUrl,
        alias: '',
        tokenId: '',
        isSeed: false,
        seedType: undefined,
      };
    } else {
      const _asset = state as INftInfoType;
      return {
        chainId: chainId,
        decimals: _asset.decimals,
        address: _asset.tokenContractAddress || '', // contract address
        symbol: _asset.symbol,
        name: _asset.symbol,
        imageUrl: _asset.imageUrl,
        alias: _asset.alias,
        tokenId: _asset.tokenId,
        isSeed: _asset.isSeed,
        seedType: _asset.seedType,
        label: _asset.label,
      };
    }
  }, [chainId, state, type]);

  const { isPrompt } = useCommonState();
  const chainInfo = useCurrentChain(chainId);

  const wallet = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();
  const currentNetworkInfo = useCurrentNetworkInfo();

  const getTransferFee = useGetTransferFee();
  const { t } = useTranslation();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const oneTimeApprovalList = useRef<GuardianItem[]>([]);
  const [toAccount, setToAccount] = useState<ToAccount>(state?.toAccount || { address: '' });
  const [stage, setStage] = useState<SendStage>(state?.stage || SendStage.Address);
  const [amount, setAmount] = useState(state?.amount || '');
  const [usdAmount, setUSDAmount] = useState<string>('');
  const [balance, setBalance] = useState(state?.balance || '');
  const [maxAmount, setMaxAmount] = useState<string>('0');
  const maxUsdAmount = useMemo(
    () => ZERO.plus(maxAmount).times(tokenPriceObject[tokenInfo.symbol]).toFixed(2),
    [maxAmount, tokenInfo.symbol, tokenPriceObject],
  );
  const [amountErrMsg, setAmountErrMsg] = useState('');
  const currentChain = useCurrentChain(chainId);
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const { withdraw, withdrawPreview } = useCrossTransferByEtransfer();
  const { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig } = useGetEBridgeConfig();
  const { fetchContactSupportConfig } = useContactNetworkConfig();
  const [warning, setWarning] = useState<WarningKey | undefined>();
  const aelfChainList = useCurrentChainList();
  // network list
  const [chainList, setChainList] = useState<INetworkItem[]>([]);
  const [targetNetwork, setTargetNetwork] = useState<INetworkItem>();
  const recommendETransfer = useMemo(
    () => targetNetwork?.serviceList?.find((ele) => ele?.serviceName?.toLocaleLowerCase()?.includes('transfer')),
    [targetNetwork?.serviceList],
  );
  const recommendEBridge = useMemo(
    () => targetNetwork?.serviceList?.find((ele) => ele?.serviceName?.toLocaleLowerCase()?.includes('bridge')),
    [targetNetwork?.serviceList],
  );
  const [curModalTipKey, setCurModalTipKey] = useState<ModalTipKeyEnum | undefined>();
  const [addressType, setAddressType] = useState<AddressTypeEnum>(AddressTypeEnum.EXCHANGE);
  const [isCheckAddressFinish, setIsCheckAddressFinish] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [networkFee, setNetworkFee] = useState<string>();
  const [networkFeeUnit, setNetworkFeeUnit] = useState<string>();
  const [transactionFee, setTransactionFee] = useState<string>();
  const [transactionUnit, setTransactionUnit] = useState<string>();
  const [receiveAmount, setReceiveAmount] = useState<string>();
  const [receiveAmountUsd, setReceiveAmountUsd] = useState<string>();
  const [transferType, setTransferType] = useState(TransferType.GENERAL_SAME_CHAIN);
  const [eBridgeFeeNotEnough, setEBridgeFeeNotEnough] = useState(false);
  const pin = usePin();
  useFetchTxFee();
  const defaultToken = useDefaultToken(chainId);
  useEffectOnce(() => {
    getTokenPrice(tokenInfo.symbol);
    fetchContactSupportConfig();
  });
  const modalTipContent = useMemo(() => {
    return {
      [ModalTipKeyEnum.dAppChainToExchange]: {
        title: `Unsupported: Direct Transfer from dAppChain to Exchange`,
        content: `Currently, ${tokenInfo.symbol} tokens can only be transferred to an exchange via the aelf MainChain. Please transfer them to your MainChain address first before sending them to the exchange.`,
        buttonGroupType: 'col' as ButtonGroupType,
        buttons: [
          {
            type: 'primary' as ButtonType,
            onClick: () => {
              setToAccount((pre) => ({ ...pre, address: `ELF_${pre.address}_${MAIN_CHAIN_ID}` }));
              setStage(SendStage.Amount);
              setCurModalTipKey(undefined);
            },
            content: 'Send to my aelf MainChain',
          },
          {
            type: 'default' as ButtonType,
            onClick: () => {
              setCurModalTipKey(undefined);
            },
            content: 'Cancel',
          },
        ],
      },
      [ModalTipKeyEnum.eBridge]: {
        title: `Confirm transfer with eBridge`,
        content: `To protect your assets, this transfer will be processed via eBridge, a 3rd-party decentralized platform. Learn more`,
        buttonGroupType: 'row' as ButtonGroupType,
        buttons: [
          {
            type: 'primary' as ButtonType,
            onClick: () => {
              setCurModalTipKey(undefined);
              setStage(SendStage.Preview);
            },
            content: 'Agree and continue',
          },
        ],
      },
      [ModalTipKeyEnum.unSupportedAsset]: {
        title: `Unsupported asset`,
        content: `The asset does not exist on the target chain, so the transfer cannot be completed. Please check the asset and try again with a supported chain.`,
        buttonGroupType: 'row' as ButtonGroupType,
        buttons: [
          {
            type: 'primary' as ButtonType,
            onClick: () => {
              setCurModalTipKey(undefined);
            },
            content: 'OK',
          },
        ],
      },
      [ModalTipKeyEnum.crossChain]: {
        title: `Confirm to proceed`,
        content: `Direct transfers from dAppChain to exchanges are not supported and may result in asset loss. Please use only non-exchange addresses.`,
        buttonGroupType: 'row' as ButtonGroupType,
        buttons: [
          {
            type: 'default' as ButtonType,
            onClick: () => {
              setCurModalTipKey(undefined);
            },
            content: 'Cancel',
          },
          {
            type: 'primary' as ButtonType,
            onClick: () => {
              setStage(SendStage.Amount);
              setCurModalTipKey(undefined);
            },
            content: 'Proceed',
          },
        ],
      },
    };
  }, [tokenInfo.symbol]);

  const getTransactionFee = useCallback(
    async (num = ''): Promise<string | void> => {
      console.log('getTransactionFee');

      try {
        if (!toAccount?.address) throw 'No toAccount';
        const { privateKey } = await getSeed();
        if (!privateKey) throw t(WalletError.invalidPrivateKey);
        if (!currentChain) throw 'No ChainInfo';
        const isAELFCross = isCrossChain(toAccount.address, chainId);
        console.log(isAELFCross, tokenInfo, '===isAELFCross');

        const sendAmount = num || amount;

        const fee = await getTransferFee(isAELFCross, {
          sendAmount,
          decimals: tokenInfo.decimals,
          symbol: tokenInfo.symbol,
          toAddress: getEntireDIDAelfAddress(toAccount.address, undefined, tokenInfo.chainId),
          chainId: tokenInfo.chainId,
        });
        return fee;
      } catch (error) {
        console.log('getFee===error', error);
        if (error === TransactionError.TRANSFER_AMOUNT_EXCEEDED) {
          return '0';
        }
      }
    },
    [amount, chainId, currentChain, getTransferFee, t, toAccount.address, tokenInfo],
  );

  const sendTransfer = useCallback(async () => {
    try {
      setBtnLoading(true);

      const { privateKey } = await getSeed();
      if (!chainInfo || !privateKey || !currentChain) return;
      if (!tokenInfo) throw 'No Symbol info';

      if (transferType === TransferType.GENERAL_SAME_CHAIN) {
        await sameChainTransfer({
          chainInfo,
          chainType: currentNetworkInfo.walletType,
          privateKey,
          tokenInfo,
          amount: timesDecimals(amount, tokenInfo.decimals).toFixed(),
          toAddress: toAccount.address,
        });
      } else if (transferType === TransferType.GENERAL_CROSS_CHAIN) {
        await crossChainTransfer({
          chainInfo,
          chainType: currentNetworkInfo.walletType,
          privateKey,
          tokenInfo,
          amount: timesDecimals(amount, tokenInfo.decimals).toFixed(),
          toAddress: toAccount.address,
        });
      } else if (transferType === TransferType.E_TRANSFER) {
        let network = '';
        if (isDIDAelfAddress(toAccount.address)) {
          const arr = toAccount?.address.split('_');
          network = arr[arr.length - 1];
        } else {
          network = targetNetwork?.network || getAddressChainId(toAccount?.address, 'AELF') || 'AELF';
        }
        console.log('params', {
          chainId,
          toAddress: toAccount.address,
          network,
          amount,
          tokenInfo: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: Number(tokenInfo.decimals),
          },
        });
        console.log('withdraw', {
          chainId,
          toAddress: toAccount.address,
          network,
          amount,
          tokenInfo: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: Number(tokenInfo.decimals),
          },
        });

        const crossTransferByEtransferResult = await withdraw({
          chainId,
          toAddress: toAccount.address,
          network,
          amount,
          tokenInfo: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: Number(tokenInfo.decimals),
          },
        });

        console.log('crossTransferByEtransferResult', crossTransferByEtransferResult);
      } else if (transferType === TransferType.E_BRIDGE) {
        if (!wallet?.address) {
          throw 'currentWallet is null';
        }
        setEBridgeFeeNotEnough(false);
        const fromChainInfo = getAELFChainInfoConfig(tokenInfo.chainId);
        const toChainInfo = getEVMChainInfoConfig(targetNetwork?.network || '');

        const tokenEBridgeInfo = getTokenConfig(tokenInfo.symbol);
        const bridge = new CrossEBridgeExtension(
          {
            fromChainInfo,
            toChainInfo,
            tokenInfo: tokenEBridgeInfo,
          },
          pin,
          wallet,
          currentChain,
        );

        const fee = await bridge.getELFFee();
        const needElfBalance =
          tokenInfo.symbol === defaultToken.symbol
            ? timesDecimals(amount, defaultToken.decimals).plus(fee).toString()
            : fee;

        const elfBalance = await getBalance({
          rpcUrl: currentChain.endPoint,
          address: tokenInfo.address,
          chainType: currentNetworkInfo.walletType,
          paramsOption: {
            owner: wallet?.address,
            symbol: 'ELF',
          },
        });
        if (ZERO.plus(needElfBalance).isGreaterThan(elfBalance.result.balance)) {
          setEBridgeFeeNotEnough(true);
          setAmountErrMsg(TransactionError.FEE_NOT_ENOUGH);
          throw 'No enough fee';
        }

        const limit = bridge.getLimit();
        console.log('fee,limit', fee, limit);
        const createReceiptResult = await bridge.createReceipt({
          targetAddress: toAccount.address,
          amount: String(amount),
          owner: wallet?.address,
          account: wallet?.address,
        });
        console.log(createReceiptResult, 'createReceiptResult===EBridge');
      }
      setStage(SendStage.Completed);

      const _chainId = getChainIdByAddress(toAccount?.address);

      const aelfIcon = aelfChainList?.find((ele) => ele?.chainId === _chainId)?.chainImageUrl;

      addRecent({
        recentItem: {
          chainId: targetNetwork?.network ? undefined : (_chainId as ChainId),
          network: targetNetwork?.network || currentNetworkInfo.walletType,
          networkIcon: targetNetwork?.imageUrl || aelfIcon || '',
          address: toAccount.address,
          transferTime: Date.now(),
        },
      });
    } catch (error: any) {
      setBtnLoading(false);
      singleMessage.error(handleErrorMessage(error, 'Transfer Failed'));
    } finally {
      setBtnLoading(false);
    }
  }, [
    chainInfo,
    currentChain,
    tokenInfo,
    transferType,
    toAccount.address,
    aelfChainList,
    addRecent,
    targetNetwork?.network,
    targetNetwork?.imageUrl,
    amount,
    chainId,
    withdraw,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    pin,
    wallet,
    defaultToken.symbol,
    defaultToken.decimals,
    currentNetworkInfo.walletType,
  ]);

  const { max: maxFee, crossChain: crossChainFee, etransfer: etransferFee } = useGetTxFee(chainId);

  const getEtransferAllowance = useCallback(
    async (token: BaseToken) => {
      if (!currentChain) throw 'No currentChain';

      const tokenContract = new ExtensionContractBasic({
        rpcUrl: currentChain.endPoint,
        contractAddress: currentChain.defaultToken.address,
        privateKey: COMMON_PRIVATE,
      });
      const allowanceRes = await tokenContract.callViewMethod('GetAllowance', {
        symbol: token.symbol,
        owner: wallet?.address,
        spender: currentNetworkInfo.eTransferCA?.[token.chainId],
      });

      if (allowanceRes?.error) throw allowanceRes?.error;
      const allowance = divDecimals(allowanceRes.data.allowance ?? allowanceRes.data.amount ?? 0, token.decimals);
      return allowance;
    },
    [currentChain, currentNetworkInfo.eTransferCA, wallet?.address],
  );

  const getEtransferMaxFee = useCallback(
    // approve fee
    async ({ amount }: { amount: string }) => {
      const token = tokenInfo;
      try {
        const arr = toAccount.address.split('_');
        const network = arr[arr.length - 1];

        console.log(
          {
            chainId: token.chainId,
            address: toAccount.address,
            symbol: token.symbol,
            network,
            currentAccountAddress: wallet?.address || '',
          },
          '======getEtransferMaxFee',
        );

        const [{ withdrawInfo }, allowance] = await Promise.all([
          withdrawPreview({
            chainId: token.chainId,
            address: toAccount.address,
            symbol: token.symbol,
            network,
            currentAccountAddress: wallet?.address || '',
          }),
          getEtransferAllowance(token),
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
    [tokenInfo, toAccount.address, wallet?.address, withdrawPreview, getEtransferAllowance, etransferFee],
  );

  const updateBalance = useCallback(async () => {
    if (!currentChain || !wallet?.address) return;
    const result = await getBalance({
      rpcUrl: currentChain.endPoint,
      address: tokenInfo.address,
      chainType: currentNetworkInfo.walletType,
      paramsOption: {
        owner: wallet?.address,
        symbol: tokenInfo.symbol,
      },
    });
    setBalance(result.result.balance);
  }, [currentChain, currentNetworkInfo.walletType, tokenInfo.address, tokenInfo.symbol, wallet?.address]);

  useEffectOnce(() => {
    updateBalance();
  });

  const getMaxAmount = useCallback(async () => {
    if (!balance) return setMaxAmount('0');

    const balanceBN = divDecimals(balance, tokenInfo.decimals);
    const balanceStr = balanceBN.toString();

    // balance 0
    if (balanceBN.isEqualTo(0)) {
      return setMaxAmount('0');
    }

    // if other tokens
    if (tokenInfo.symbol !== defaultToken.symbol) {
      return setMaxAmount(balanceBN.toFixed());
    }

    // elf <= maxFee
    if (balanceBN.isLessThanOrEqualTo(maxFee)) {
      return setMaxAmount(balanceBN.toFixed());
    }

    let fee;
    try {
      fee = await getTransactionFee();
      console.log(fee, '=======fee');
    } catch (error) {
      fee = '0';
      console.log('FEE ERROR');
    }

    const eTransferFee = await getEtransferMaxFee({ amount: balanceStr });

    const _max = fee
      ? balanceBN.minus(eTransferFee)
      : ZERO.plus(divDecimals(balance, tokenInfo.decimals)).minus(maxFee).minus(eTransferFee);

    setMaxAmount(_max.gt(ZERO) ? _max.toFixed() : '0');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, defaultToken.symbol, maxFee, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.address]);

  useEffect(() => {
    getMaxAmount();
  }, [getMaxAmount]);

  const onClickMax = useCallback(async () => {
    setAmount(maxAmount);
    setUSDAmount(maxUsdAmount);
    setAmountErrMsg('');
  }, [maxAmount, maxUsdAmount]);

  const previewCheck = useCallback(async () => {
    console.log('previewCheck', warning);

    setAmountErrMsg('');
    setBtnLoading(true);
    console.log('previewCheck click!');
    try {
      if (!currentChain) {
        console.log('previewCheck error === currentChain is not exist');
        return { status: false };
      }

      if (!wallet?.address) {
        console.log('wallet address does not exist');
        return { status: false };
      }
      const tokenSymbol = tokenInfo.symbol;

      // CHECK 4: balance
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: tokenInfo.address,
        chainType: currentNetworkInfo.walletType,
        paramsOption: {
          owner: wallet?.address,
          symbol: tokenInfo.symbol,
        },
      });
      console.log(result, '=====result');

      setBalance(result.result.balance);
      const balance = result.result.balance;
      if (!balance) {
        setAmountErrMsg(TransactionError.TOKEN_NOT_ENOUGH);
        return { status: false };
      }
      if (type === SendPageTypeEnum.token) {
        // insufficient balance check
        if (timesDecimals(amount, tokenInfo.decimals).isGreaterThan(balance)) {
          setAmountErrMsg(TransactionError.TOKEN_NOT_ENOUGH);
          return { status: false };
        }
        if (isCrossChain(toAccount.address, chainId) && symbol === defaultToken.symbol) {
          if (ZERO.plus(crossChainFee).isGreaterThanOrEqualTo(amount)) {
            setAmountErrMsg(TransactionError.CROSS_NOT_ENOUGH);
            return { status: false };
          }
        }
      } else if (type === SendPageTypeEnum.nft) {
        if (timesDecimals(amount, tokenInfo.decimals).isGreaterThan(balance)) {
          setAmountErrMsg(TransactionError.NFT_NOT_ENOUGH);
          return { status: false };
        }
      } else {
        return { status: false };
      }

      // CHECK 6: fee check
      let networkFee: string | undefined;
      let networkFeeUnit: string | undefined;
      let transactionFee: string | undefined;
      let transactionUnit: string | undefined;
      let receiveAmount: string | undefined;
      let receiveAmountUsd: string | undefined;
      let transferType = TransferType.GENERAL_SAME_CHAIN;

      // CHECK 6.1 isRecommendEtransfer(to evm) fee check
      if (
        warning === WarningKey.MAKE_SURE_SUPPORT_PLATFORM &&
        recommendETransfer &&
        ZERO.plus(recommendETransfer?.maxAmount).isGreaterThan(amount)
      ) {
        console.log('6.1');

        try {
          const [{ withdrawInfo }, allowance] = await Promise.all([
            withdrawPreview({
              chainId,
              address: toAccount.address,
              symbol: tokenSymbol,
              amount,
              network: targetNetwork?.network || '',
              currentAccountAddress: wallet?.address || '',
              isMainnet: currentNetwork === 'MAINNET',
            }),
            getEtransferAllowance(tokenInfo),
          ]);
          console.log(withdrawInfo, '=====withdrawInfo');

          let _etransferFee = etransferFee;

          const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo.maxAmount) : true;
          const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo.minAmount) : true;

          const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

          if ((amountAllowed && allowance.gte(amount)) || tokenSymbol !== defaultToken.symbol) _etransferFee = 0;

          if (ZERO.plus(amount).plus(_etransferFee).gt(divDecimals(balance, tokenInfo.decimals))) {
            setAmountErrMsg(TransactionError.TOKEN_NOT_ENOUGH);
            return { status: false };
          }

          if (amountAllowed) {
            networkFee = withdrawInfo?.aelfTransactionFee;
            networkFeeUnit = 'ELF';
            transactionFee = withdrawInfo.transactionFee;
            transactionUnit = withdrawInfo.transactionUnit;
            receiveAmount = withdrawInfo?.receiveAmount;
            receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
            transferType = TransferType.E_TRANSFER;
            setNetworkFee(networkFee);
            setNetworkFeeUnit(networkFeeUnit);
            setReceiveAmount(receiveAmount);
            setReceiveAmountUsd(receiveAmountUsd);
            setTransactionFee(transactionFee);
            setTransactionUnit(transactionUnit);
            console.log('transferType1', transferType);
            setTransferType(transferType);
            return {
              status: true,
              networkFee,
              networkFeeUnit,
              receiveAmount,
              receiveAmountUsd,
              transactionFee,
              transactionUnit,
              transferType,
              targetNetwork: targetNetwork,
            };
          } else {
            setAmountErrMsg(
              getLimitTips(tokenInfo.label || tokenInfo.symbol, withdrawInfo.minAmount, withdrawInfo.maxAmount),
            );
            throw 'eTransfer err';
          }
        } catch (error) {
          console.log('isRecommendEtransfer err', error);
          return { status: false };
        } finally {
          setBtnLoading(false);
        }
      }

      // CHECK 6.2 isRecommendEBridge(to evm) fee check
      if (warning === WarningKey.MAKE_SURE_SUPPORT_PLATFORM && recommendEBridge) {
        try {
          setBtnLoading(true);
          const fromChainInfo = getAELFChainInfoConfig(tokenInfo.chainId);
          const toChainInfo = getEVMChainInfoConfig(targetNetwork?.network || '');
          const tokenEBridgeInfo = getTokenConfig(tokenInfo.symbol);
          const bridge = new CrossEBridgeExtension(
            {
              fromChainInfo,
              toChainInfo,
              tokenInfo: tokenEBridgeInfo,
            },
            pin,
            wallet,
            currentChain,
          );

          receiveAmount = amount;
          receiveAmountUsd = ZERO.plus(amount).times(tokenPriceObject[tokenInfo.symbol]).toString();

          // fee
          const f = await bridge.getELFFee();

          // limit
          const limit = await bridge.getLimit();
          console.log('getELFFee', f, 'getLimit', limit);
          const targetLimit = getSmallerValue(limit.remain, limit.currentCapacity);
          if (limit.isEnable && timesDecimals(amount, tokenInfo.decimals || '0').isGreaterThan(targetLimit)) {
            setAmountErrMsg(getLimitTips(tokenInfo.symbol, '0', formatAmountShow(targetLimit)));
            return { status: false };
          }
          transactionFee = divDecimals(f, defaultToken.decimals).toString();
          transactionUnit = 'ELF';
          transferType = TransferType.E_BRIDGE;
          if (ZERO.plus(recommendEBridge.maxAmount).lt(amount)) {
            // setCurModalTipKey(ModalTipKeyEnum.eBridge);
          }
          setNetworkFee(networkFee);
          setNetworkFeeUnit(networkFeeUnit);
          setReceiveAmount(receiveAmount);
          setReceiveAmountUsd(receiveAmountUsd);
          setTransactionFee(transactionFee);
          setTransactionUnit(transactionUnit);
          console.log('transferType2', transferType);
          setTransferType(transferType);
          return {
            status: true,
            networkFee,
            networkFeeUnit,
            transactionFee,
            transactionUnit,
            receiveAmount,
            receiveAmountUsd,
            transferType,
            targetNetwork,
          };
        } catch (error) {
          console.log('isRecommendEBridge(to evm) err', error);
          return { status: false };
        } finally {
          setBtnLoading(false);
        }
      }

      // CHECK 6.3 CrossChain in aelf support ETransfer
      if (isCrossChain(toAccount.address, chainId) && CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenSymbol)) {
        console.log('CHECK 6.3');

        const [{ withdrawInfo }, allowance] = await Promise.all([
          withdrawPreview({
            symbol: tokenInfo.symbol,
            address: toAccount.address,
            chainId: tokenInfo.chainId,
            amount,
            network: getAddressChainId(toAccount.address, 'AELF') || 'AELF',
            currentAccountAddress: wallet?.address || '',
            isMainnet: currentNetwork === 'MAINNET',
          }),
          getEtransferAllowance(tokenInfo),
        ]);
        console.log(withdrawInfo, '====withdrawInfo');

        let _etransferFee = etransferFee;

        const isGTMax = withdrawInfo?.maxAmount ? ZERO.plus(amount).lte(withdrawInfo.maxAmount) : true;
        const isLTMin = withdrawInfo?.minAmount ? ZERO.plus(amount).gte(withdrawInfo.minAmount) : true;

        const amountAllowed = withdrawInfo ? isGTMax && isLTMin : false;

        if ((amountAllowed && allowance.gte(amount)) || tokenSymbol !== defaultToken.symbol) _etransferFee = 0;

        if (ZERO.plus(amount).plus(_etransferFee).gt(divDecimals(balance, tokenInfo.decimals))) {
          setAmountErrMsg(TransactionError.TOKEN_NOT_ENOUGH);
          return { status: false };
        }

        if (amountAllowed) {
          networkFee = withdrawInfo?.aelfTransactionFee;
          networkFeeUnit = 'ELF';
          transactionFee = withdrawInfo.transactionFee;
          transactionUnit = withdrawInfo.transactionUnit;
          receiveAmount = withdrawInfo?.receiveAmount;
          receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
          transferType = TransferType.E_TRANSFER;
          setNetworkFee(networkFee);
          setNetworkFeeUnit(networkFeeUnit);
          setReceiveAmount(receiveAmount);
          setReceiveAmountUsd(receiveAmountUsd);
          setTransactionFee(transactionFee);
          setTransactionUnit(transactionUnit);
          console.log('transferType3', transferType);
          setTransferType(transferType);
          return {
            status: true,
            networkFee,
            networkFeeUnit,
            receiveAmount,
            receiveAmountUsd,
            transactionFee,
            transactionUnit,
            transferType,
            targetNetwork: targetNetwork,
          };
        }
      }

      // CHECK 6.4 SameChain or Default CrossChain
      networkFeeUnit = 'ELF';
      transferType = isCrossChain(toAccount.address, chainId)
        ? TransferType.GENERAL_CROSS_CHAIN
        : TransferType.GENERAL_SAME_CHAIN;
      const fee = await getTransactionFee();
      console.log(
        'wfs===isCrossChain',
        isCrossChain(toAccount.address, chainId),
        'toAccount.address, chainId',
        toAccount.address,
        chainId,
        'fee',
        fee,
      );
      if (fee) {
        networkFee = fee;
      } else {
        setAmountErrMsg(TransactionError.FEE_NOT_ENOUGH);
        return { status: false };
      }

      setNetworkFee(networkFee);
      setNetworkFeeUnit(networkFeeUnit);
      setReceiveAmount(receiveAmount);
      setReceiveAmountUsd(receiveAmountUsd);
      setTransactionFee(transactionFee);
      setTransactionUnit(transactionUnit);
      console.log('transferType4', transferType);
      setTransferType(transferType);
      console.log(
        {
          status: true,
          networkFee,
          networkFeeUnit,
          receiveAmount,
          receiveAmountUsd,
          transactionFee,
          transactionUnit,
          transferType,
        },
        '======previewCheck-return',
      );

      return {
        status: true,
        networkFee,
        networkFeeUnit,
        receiveAmount,
        receiveAmountUsd,
        transactionFee,
        transactionUnit,
        transferType,
      };
    } catch (error: any) {
      console.log('previewCheck===error', error);
      return { status: false };
    } finally {
      setBtnLoading(false);
    }
  }, [
    currentChain,
    tokenInfo,
    currentNetworkInfo.walletType,
    type,
    warning,
    recommendETransfer,
    amount,
    recommendEBridge,
    toAccount,
    chainId,
    getTransactionFee,
    symbol,
    defaultToken.symbol,
    defaultToken.decimals,
    crossChainFee,
    withdrawPreview,
    targetNetwork,
    currentNetwork,
    getEtransferAllowance,
    etransferFee,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    pin,
    wallet,
    tokenPriceObject,
  ]);
  const toPreviewStage = useCallback(async () => {
    const result = await previewCheck();
    console.log('wfs===', result);
    if (!result?.status) {
      return;
    }
    if (transferType === TransferType.E_BRIDGE) {
      return setCurModalTipKey(ModalTipKeyEnum.eBridge);
    }
    setStage(SendStage.Preview);
  }, [previewCheck, transferType]);

  const sendHandler = useCallback(async (): Promise<string | void> => {
    await sendTransfer();
  }, [sendTransfer]);

  const showStrangerAddress = useMemo(() => {
    if (toAccount.address) {
      return checkAddressIsRecent({
        fromChainId: chainId,
        tokenId: tokenInfo.symbol || tokenInfo.tokenId || '',
        isFt: type === SendPageTypeEnum.nft,
        address: toAccount.address,
      });
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAccount.address]);

  const adsCheckWarningRender = useMemo(() => {
    if (!warning) {
      if (!showStrangerAddress) {
        return (
          <CommonPromptCard
            type={AdsCheckWarningTip[WarningKey.STRANGE_ADDRESS].type}
            description={AdsCheckWarningTip[WarningKey.STRANGE_ADDRESS].desc}
          />
        );
      }
      return null;
    }
    const _tip = AdsCheckWarningTip[warning];
    return <CommonPromptCard type={_tip.type} description={_tip.desc} />;
  }, [showStrangerAddress, warning]);

  const adsInputBtnTitle = useMemo(() => {
    if (
      (!toAccount.address ||
        !isCheckAddressFinish ||
        warning === WarningKey.MAKE_SURE_SUPPORT_PLATFORM ||
        warning === WarningKey.INVALID_ADDRESS ||
        warning === WarningKey.SAME_ADDRESS) &&
      stage === SendStage.Address
    ) {
      return '';
    }
    if (stage === SendStage.Address && warning === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF)
      return 'Confirm and continue';
    return 'Next';
  }, [isCheckAddressFinish, stage, toAccount.address, warning]);

  const btnDisabled = useMemo(() => {
    if (stage === SendStage.Address) {
      return warning === WarningKey.INVALID_ADDRESS || warning === WarningKey.SAME_ADDRESS;
    }
    // InputStepEnum.show
    if (!toAccount?.address) {
      return true;
    }
    if (!isValidAmount(amount)) {
      return true;
    }
    if (amountErrMsg) {
      return true;
    }
    return false;
  }, [amount, amountErrMsg, stage, toAccount?.address, warning]);

  const onPressContactItem = useCallback(
    async (i: TFormattedRecentItem) => {
      console.log('onPressTabItem', i);
      try {
        if (i.addressInfo?.address === wallet?.address || i.address === wallet?.address) {
          // anther chain address
          toAddressInputRef.current?.onInput(
            addressFormat(i.address || i.addressInfo?.address, i.chainId || i.addressInfo?.chainId),
          );
        } else if (i.network !== 'aelf' && i.addressInfo?.network !== 'aelf') {
          setBtnLoading(true);
          const { data } = await getSendNetworkList({
            symbol: tokenInfo?.symbol || '',
            chainId: tokenInfo?.chainId || 'AELF',
            toAddress: i?.address || i?.addressInfo?.address || '',
          });

          console.log('getSendNetworkList', data, i);
          const tmpNetwork = data?.networkList?.find(
            (ele: any) => ele.network === (i?.network || i.addressInfo?.network),
          );

          if (!tmpNetwork) {
            throw 'not supported';
          }
          console.log('tmpNetwork', tmpNetwork);
          setTargetNetwork(tmpNetwork);
          setChainList(data?.networkList);
          // setSelectedToContact({ name: i?.name, address: i.address || i.addressInfo?.address } as TToInfo);
          setToAccount({
            address: i.address || i.addressInfo?.address || '',
            name: i.name || '',
          });
          setStage(SendStage.Amount);
          setWarning(WarningKey.MAKE_SURE_SUPPORT_PLATFORM);
        } else {
          toAddressInputRef.current?.onInput(
            i.addressInfo?.isExchange || !i.addressInfo
              ? i.address || i.addressInfo?.address || ''
              : addressFormat(i.address || i.addressInfo?.address || '', i.chainId || i.addressInfo?.chainId),
          );
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        setBtnLoading(false);
      }
    },
    [tokenInfo?.chainId, tokenInfo?.symbol, wallet?.address],
  );

  const StageObj: TypeStageObj = useMemo(
    () => ({
      [SendStage.Address]: {
        headerText: `Send ${type === SendPageTypeEnum.token ? tokenInfo.label ?? symbol : ''}`,
        btnText: adsInputBtnTitle,
        handler: () => {
          if (warning === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && addressType === AddressTypeEnum.EXCHANGE) {
            return setCurModalTipKey(ModalTipKeyEnum.dAppChainToExchange);
          }
          if (warning === WarningKey.CROSS_CHAIN) {
            return setCurModalTipKey(ModalTipKeyEnum.crossChain);
          }
          setStage(SendStage.Amount);
        },
        backFun: () => {
          navigate('/');
        },
        element: toAccount.address ? (
          <div className="address-warning-warp portkey-ui-flex-column-center">
            {warning === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && (
              <div className="send-to-an-exchange">{`Send to an exchange?`}</div>
            )}
            {isCheckAddressFinish && adsCheckWarningRender}
            {warning === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && <ExchangeTypeShow />}
            {warning === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && (
              <AddressTypeSelect value={addressType} onChangeValue={setAddressType} />
            )}
            {warning === WarningKey.MAKE_SURE_SUPPORT_PLATFORM && (
              <SelectNetwork
                networkList={chainList}
                onSelect={(item) => {
                  setTargetNetwork(item);
                  setStage(SendStage.Amount);
                }}
              />
            )}
          </div>
        ) : (
          <AddressSelector
            isFt={type === SendPageTypeEnum.token}
            chainId={tokenInfo?.chainId}
            tokenId={tokenInfo?.symbol || tokenInfo?.tokenId || ''}
            onClick={onPressContactItem}
          />
        ),
      },
      [SendStage.Amount]: {
        headerText: 'Enter Amount',
        btnText: amountErrMsg || 'Preview',
        handler: toPreviewStage,
        backFun: () => {
          setStage(SendStage.Address);
          setAmount('');
          setUSDAmount('');
          setAmountErrMsg('');
          setEBridgeFeeNotEnough(false);
          oneTimeApprovalList.current = [];
        },
        element:
          type === SendPageTypeEnum.token ? (
            <>
              <TokenBalanceShow
                label={tokenInfo.label}
                symbol={tokenInfo.symbol}
                imageUrl={tokenInfo.imageUrl}
                balance={balance}
                decimals={tokenInfo.decimals}
                onClickMax={onClickMax}
              />
              <TokenInput
                token={tokenInfo}
                amount={amount}
                usdAmount={usdAmount}
                amountErrMsg={amountErrMsg}
                onAmountChange={setAmount}
                onUsdAmountChange={setUSDAmount}
                setAmountErrMsg={setAmountErrMsg}
              />
            </>
          ) : (
            <>
              <NFTBalanceShow
                symbol={tokenInfo.symbol}
                alias={tokenInfo.alias || ''}
                tokenId={tokenInfo.tokenId || ''}
                imageUrl={tokenInfo.imageUrl}
                balance={balance}
                decimals={tokenInfo.decimals}
                onClickMax={onClickMax}
                isSeed={tokenInfo.isSeed}
                seedType={tokenInfo.seedType}
              />
              <NFTInput
                amount={amount}
                setAmountErrMsg={setAmountErrMsg}
                amountErrMsg={amountErrMsg}
                onChange={setAmount}
                token={tokenInfo}
              />
            </>
          ),
      },
      [SendStage.Preview]: {
        headerText: 'Preview',
        btnText: 'Send',
        handler: sendHandler,
        backFun: () => {
          setStage(SendStage.Amount);
          oneTimeApprovalList.current = [];
        },
        element: (
          <SendPreview
            toAccount={toAccount}
            chainId={chainId}
            tokenInfo={tokenInfo}
            amount={amount}
            usdAmount={usdAmount}
            targetNetwork={targetNetwork}
            transferType={transferType}
            eBridgeFeeNotEnough={eBridgeFeeNotEnough}
            transactionFee={transactionFee}
            transactionUnit={transactionUnit}
            networkFee={networkFee}
            networkFeeUnit={networkFeeUnit}
            receiveAmount={receiveAmount}
            receiveAmountUsd={receiveAmountUsd}
          />
        ),
      },
      [SendStage.Completed]: {
        headerText: '',
        btnText: '',
        handler: () => {
          //
        },
        backFun: () => {
          setStage(SendStage.Amount);
          oneTimeApprovalList.current = [];
        },
        element: <></>,
      },
    }),
    [
      type,
      tokenInfo,
      symbol,
      adsInputBtnTitle,
      toAccount,
      warning,
      isCheckAddressFinish,
      adsCheckWarningRender,
      addressType,
      chainList,
      onPressContactItem,
      amountErrMsg,
      toPreviewStage,
      balance,
      onClickMax,
      amount,
      usdAmount,
      sendHandler,
      chainId,
      targetNetwork,
      transferType,
      eBridgeFeeNotEnough,
      transactionFee,
      transactionUnit,
      networkFee,
      networkFeeUnit,
      receiveAmount,
      receiveAmountUsd,
      navigate,
    ],
  );

  const clickHelp = useCallback(() => {
    const openWinder = window.open(SEND_HELP_URL, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, []);

  const mainContent = useMemo(() => {
    return (
      <div className={clsx(['page-send flex-column', isPrompt && 'detail-page-prompt'])}>
        {stage === SendStage.Completed ? (
          <Completed toAddress={formatStr2EllipsisStr(toAccount.address, 8)} onClose={() => navigate('/')} />
        ) : (
          <>
            <CommonHeader
              title={StageObj[stage].headerText}
              onLeftBack={() => {
                StageObj[stage].backFun();
              }}
              rightElementList={
                stage !== SendStage.Address
                  ? [
                      {
                        customSvgType: 'help',
                        onClick: clickHelp,
                      },
                    ]
                  : []
              }
            />
            {(stage === SendStage.Address || stage === SendStage.Amount) && (
              <ToAddressInput
                ref={toAddressInputRef}
                toAccount={toAccount}
                setToAccount={setToAccount}
                sendType={type as SendPageTypeEnum}
                stage={stage}
                warning={warning}
                setWarning={setWarning}
                selectedToken={tokenInfo as any}
                setChainList={setChainList}
                checkFinish={isCheckAddressFinish}
                setCheckFinish={setIsCheckAddressFinish}
                setSendAmount={setAmount}
                setSendUSDAmount={setUSDAmount}
                setStage={setStage}
              />
            )}
            <div
              className={clsx(
                'stage-ele',
                'flex-column',
                'flex-1',
                stage === SendStage.Preview && 'stage-ele-preview',
              )}>
              {StageObj[stage].element}
            </div>
            {StageObj[stage].btnText ? (
              <div className="btn-wrap">
                <CommonButton
                  loading={btnLoading}
                  disabled={btnDisabled}
                  className="stage-btn"
                  type="primary"
                  block
                  onClick={StageObj[stage].handler}>
                  {StageObj[stage].btnText}
                </CommonButton>
              </div>
            ) : null}
          </>
        )}

        <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
        {!!curModalTipKey && (
          <SendModalTip
            open={!!curModalTipKey}
            onClose={() => setCurModalTipKey(undefined)}
            title={modalTipContent[curModalTipKey].title}
            content={modalTipContent[curModalTipKey].content}
            buttonGroupType={modalTipContent[curModalTipKey].buttonGroupType}
            buttons={modalTipContent[curModalTipKey].buttons}
          />
        )}
      </div>
    );
  }, [
    StageObj,
    btnDisabled,
    btnLoading,
    clickHelp,
    curModalTipKey,
    disclaimerOpen,
    isCheckAddressFinish,
    isPrompt,
    modalTipContent,
    navigate,
    stage,
    toAccount,
    tokenInfo,
    type,
    warning,
  ]);

  return <>{mainContent}</>;
}
