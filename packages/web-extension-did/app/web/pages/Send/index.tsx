import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { IClickAddressProps } from '@portkey-wallet/types/types-ca/contact';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import {
  formatStr2EllipsisStr,
  getAddressChainId,
  getChainIdByAddress,
  handleErrorMessage,
} from '@portkey-wallet/utils';
import { getWallet, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { divDecimals, formatAmountShow, timesDecimals } from '@portkey-wallet/utils/converter';
import { Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import crossChainTransfer, { intervalCrossChainTransfer } from 'utils/sandboxUtil/crossChainTransfer';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import AddressSelector from './components/AddressSelector';
import SendPreview from './components/SendPreview';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import getTransferFee from './utils/getTransferFee';
import { ZERO } from '@portkey-wallet/constants/misc';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { IAssetToken, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { ChainId } from '@portkey-wallet/types';
import { useCheckManagerSyncState } from 'hooks/wallet';
import './index.less';
import { useCheckLimit, useCheckSecurity } from 'hooks/useSecurity';
import { ExceedLimit } from 'constants/security';
import { ICheckLimitBusiness } from '@portkey-wallet/types/types-ca/paymentSecurity';
import GuardianApproveModal from 'pages/components/GuardianApprovalModal';
import { GuardianItem } from 'types/guardians';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { SEND_HELP_URL, TransactionError, WarningKey } from '@portkey-wallet/constants/constants-ca/send';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams } from 'hooks/router';
import { TSendLocationState, TSendPageType } from 'types/router';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { useCrossTransferByEtransfer } from 'hooks/useCrossTransferByEtransfer';
import { CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL } from '@portkey-wallet/utils/withdraw';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { COMMON_PRIVATE } from '@portkey-wallet/constants';
import { getAssetsEstimation } from '@portkey-wallet/store/store-ca/assets/api';
import { SendType } from '@portkey-wallet/types/types-ca/send';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';
import ToAddressInput, { InputStepEnum } from './components/ToAddressInput';
import SelectNetwork, { INetworkItem } from './components/SelectNetwork';
import AddressTypeSelect, { AddressTypeEnum, ExchangeTypeShow } from './components/AddressTypeSelect';
import { CommonButton, CommonPromptCard } from '@portkey/did-ui-react';
import SendModalTip, { ButtonGroupType, ButtonType } from './components/SendModalTip';
import { getLimitTips, getSmallerValue, isValidAmount } from './utils';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { ContractBasic as BaseContractBasic } from '@portkey/contracts';
import Completed from './components/Completed';
import TokenBalanceShow from 'pages/components/TokenBalanceShow';
import NFTBalanceShow from 'pages/components/NFTBalanceShow';
import NFTInput from './components/AmountInputNFT';
import TokenInput from './components/AmountInputToken';

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
    desc: `You have not used this address recently. Ensure it is the correct address before proceeding.`,
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
  [key in SendStage]: { btnText: string; handler: () => void; backFun: () => void; element: ReactElement };
};

export default function Send() {
  const navigate = useNavigate();
  const { type, symbol } = useParams();
  const { locationParams: state } = usePromptLocationParams<TSendLocationState, TSendLocationState>();
  const chainId: ChainId = useMemo(() => state.targetChainId || state.chainId, [state.chainId, state.targetChainId]);
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
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [openGuardiansApprove, setOpenGuardiansApprove] = useState<boolean>(!!state?.openGuardiansApprove);
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
  const checkManagerSyncState = useCheckManagerSyncState();
  const [txFee, setTxFee] = useState<string>();
  const currentChain = useCurrentChain(chainId);
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const caAddress = useMemo(() => wallet?.[chainId]?.caAddress || '', [chainId, wallet]);
  const { withdraw, withdrawPreview } = useCrossTransferByEtransfer();
  const { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig } = useGetEBridgeConfig();
  const [inputStep, setInputStep] = useState<InputStepEnum>(InputStepEnum.input);
  const [warning, setWarning] = useState<WarningKey | undefined>();
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
  const portkeyContractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();
  useFetchTxFee();
  const defaultToken = useDefaultToken(chainId);
  useEffectOnce(() => {
    getTokenPrice(tokenInfo.symbol);
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
              setInputStep(InputStepEnum.show);
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
              setInputStep(InputStepEnum.show);
              setCurModalTipKey(undefined);
            },
            content: 'Proceed',
          },
        ],
      },
    };
  }, [tokenInfo.symbol]);

  const retryCrossChain = useCallback(
    async ({ transactionId, params }: the2ThFailedActivityItemType) => {
      try {
        if (!chainInfo) return;
        const { privateKey } = await getSeed();
        if (!privateKey) return;
        await intervalCrossChainTransfer({ ...params, chainInfo, privateKey });
        dispatch(removeFailedActivity(transactionId));
      } catch (error) {
        console.log('retry addFailedActivity', error);
        showErrorModal({ transactionId, params });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
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

  const getTransactionFee = useCallback(
    async (num = ''): Promise<string | void> => {
      try {
        if (!toAccount?.address) throw 'No toAccount';
        const { privateKey } = await getSeed();
        if (!privateKey) throw t(WalletError.invalidPrivateKey);
        if (!currentChain) throw 'No ChainInfo';
        const feeRes = await getTransferFee({
          caAddress,
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
      caAddress,
      currentChain,
      currentNetwork.walletType,
      t,
      toAccount?.address,
      tokenInfo,
      wallet.address,
      wallet.caHash,
    ],
  );

  const sendTransfer = useCallback(async () => {
    try {
      setBtnLoading(true);

      const { privateKey } = await getSeed();
      if (!chainInfo || !privateKey || !currentChain) return;
      if (!tokenInfo) throw 'No Symbol info';

      if (!portkeyContractRef.current) {
        portkeyContractRef.current = await getContractBasic({
          contractAddress: chainInfo.caContractAddress,
          rpcUrl: chainInfo.endPoint,
          account: getWallet(privateKey),
        });
      }

      if (!tokenContractRef.current) {
        tokenContractRef.current = await getContractBasic({
          contractAddress: tokenInfo.address,
          rpcUrl: chainInfo.endPoint,
          account: getWallet(privateKey),
        });
      }

      if (transferType === TransferType.GENERAL_SAME_CHAIN) {
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
      } else if (transferType === TransferType.GENERAL_CROSS_CHAIN) {
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
        await crossChainTransfer(crossParams);
      } else if (transferType === TransferType.E_TRANSFER) {
        let network = '';
        if (isDIDAelfAddress(toAccount.address)) {
          const arr = toAccount?.address.split('_');
          network = arr[arr.length - 1];
        } else {
          network = targetNetwork?.network || getAddressChainId(toAccount?.address, 'AELF') || 'AELF';
        }

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
        if (!caAddress || !wallet.caHash) {
          throw 'currentWallet is null';
        }
        setEBridgeFeeNotEnough(false);
        const fromChainInfo = getAELFChainInfoConfig(tokenInfo.chainId);
        const toChainInfo = getEVMChainInfoConfig(targetNetwork?.network || '');

        const tokenEBridgeInfo = getTokenConfig(tokenInfo.symbol);
        const bridge = new EBridge({
          fromChainInfo,
          toChainInfo,
          tokenInfo: tokenEBridgeInfo,
        });

        const fee = await bridge.getELFFee();
        const needElfBalance =
          tokenInfo.symbol === defaultToken.symbol
            ? timesDecimals(amount, defaultToken.decimals).plus(fee).toString()
            : fee;

        const elfBalance = await getBalance({
          rpcUrl: currentChain.endPoint,
          address: tokenInfo.address,
          chainType: currentNetwork.walletType,
          paramsOption: {
            owner: caAddress,
            symbol: 'ELF',
          },
        });
        if (ZERO.plus(needElfBalance).isGreaterThan(elfBalance.result.balance)) {
          setAmountErrMsg(TransactionError.FEE_NOT_ENOUGH);
          throw 'No enough fee';
        }

        const limit = bridge.getLimit();
        console.log('fee,limit', fee, limit);

        const createReceiptResult = await bridge.createReceipt({
          tokenContract: tokenContractRef.current as unknown as BaseContractBasic,
          portkeyContract: portkeyContractRef.current as unknown as BaseContractBasic,
          targetAddress: toAccount.address,
          amount: String(amount),
          owner: caAddress,
          caHash: wallet.caHash,
        });
        console.log(createReceiptResult, 'createReceiptResult===EBridge');
      }
      setStage(SendStage.Completed);
    } catch (error: any) {
      setBtnLoading(false);
      if (error && error.type === 'crossChainTransfer') {
        dispatch(addFailedActivity(error.data));
        console.log('addFailedActivity', error);

        showErrorModal(error.data);
        return;
      } else {
        singleMessage.error(handleErrorMessage(error, 'Transfer Failed'));
      }
    } finally {
      setBtnLoading(false);
    }
  }, [
    amount,
    caAddress,
    chainId,
    chainInfo,
    currentChain,
    currentNetwork.walletType,
    defaultToken.decimals,
    defaultToken.symbol,
    dispatch,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    showErrorModal,
    targetNetwork?.network,
    toAccount.address,
    tokenInfo,
    transferType,
    txFee,
    wallet.address,
    wallet.caHash,
    withdraw,
  ]);

  const { max: maxFee, crossChain: crossChainFee, etransfer: etransferFee } = useGetTxFee(chainId);

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
        owner: caAddress,
        spender: currentNetwork.eTransferCA?.[token.chainId],
      });

      if (allowanceRes?.error) throw allowanceRes?.error;
      const allowance = divDecimals(allowanceRes.data.allowance ?? allowanceRes.data.amount ?? 0, token.decimals);
      return allowance;
    },
    [caAddress, currentChain, currentNetwork.eTransferCA],
  );

  const getEtransferMaxFee = useCallback(
    // approve fee
    async ({ amount }: { amount: string }) => {
      const token = tokenInfo;
      try {
        const arr = toAccount.address.split('_');
        const network = arr[arr.length - 1];
        const [{ withdrawInfo }, allowance] = await Promise.all([
          withdrawPreview({
            chainId: token.chainId,
            address: toAccount.address,
            symbol: token.symbol,
            network,
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

  const updateBalance = useCallback(async () => {
    if (!currentChain) return;
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
  }, [caAddress, currentChain, currentNetwork.walletType, tokenInfo.address, tokenInfo.symbol]);

  useEffectOnce(() => {
    updateBalance();
  });

  const getMaxAmount = useCallback(async () => {
    if (!balance) {
      return setMaxAmount('0');
    }

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
    } catch (error) {
      fee = '0';
      console.log('FEE ERROR');
    }

    const eTransferFee = await getEtransferMaxFee({ amount: balanceStr });

    const _max = fee
      ? balanceBN.minus(eTransferFee)
      : ZERO.plus(divDecimals(balance, tokenInfo.decimals)).minus(maxFee).minus(eTransferFee);

    setMaxAmount(_max.gt(ZERO) ? _max.toFixed() : '0');
  }, [
    balance,
    defaultToken.symbol,
    getEtransferMaxFee,
    getTransactionFee,
    maxFee,
    tokenInfo.decimals,
    tokenInfo.symbol,
  ]);

  useEffect(() => {
    getMaxAmount();
  }, [getMaxAmount]);

  const onClickMax = useCallback(async () => {
    const _isManagerSynced = await checkManagerSyncState(chainId);
    if (!_isManagerSynced) {
      return singleMessage.error(TransactionError.SYNCHRONIZING);
    }

    setAmount(maxAmount);
    setUSDAmount(maxUsdAmount);
    setAmountErrMsg('');
  }, [chainId, checkManagerSyncState, maxAmount, maxUsdAmount]);

  const checkLimit = useCheckLimit(tokenInfo.chainId);
  const handleOneTimeApproval = useCallback(() => {
    if (isPrompt) return setOpenGuardiansApprove(true);
    const params: TSendLocationState = {
      ...state,
      targetChainId: chainId,
      toAccount,
      stage,
      amount,
      balance,
      type: type as TSendPageType,
      openGuardiansApprove: true,
    };
    InternalMessage.payload(PortkeyMessageTypes.SEND, JSON.stringify(params)).send();
  }, [amount, balance, chainId, isPrompt, stage, state, toAccount, type]);

  const onCloseGuardianApprove = useCallback(() => {
    setOpenGuardiansApprove(false);
  }, []);
  const getOneTimeApproveRes = useCallback(
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

  const previewCheck = useCallback(async () => {
    setAmountErrMsg('');
    setBtnLoading(true);
    try {
      if (!currentChain) {
        console.log('previewCheck error === currentChain is not exist');
        return { status: false };
      }
      const tokenSymbol = tokenInfo.symbol;
      // CHECK 1: cross chain whether has assets
      if (isCrossChain(toAccount.address, chainId)) {
        const sendChainId = getChainIdByAddress(toAccount.address) as ChainId;
        const interceptResult = await getAssetsEstimation({
          symbol: tokenSymbol,
          chainId: sendChainId,
          type: type as SendType,
        });
        if (!interceptResult) {
          setCurModalTipKey(ModalTipKeyEnum.unSupportedAsset);
          return { status: false };
        }
      }

      // CHECK 2: manager sync
      const _isManagerSynced = await checkManagerSyncState(chainId);
      if (!_isManagerSynced) {
        singleMessage.error(TransactionError.SYNCHRONIZING);
        return { status: false };
      }

      // CHECK 3: wallet security
      const securityRes = await checkSecurity(tokenInfo.chainId);
      // TODO-SA security modal show
      if (!securityRes) return { status: false };

      // CHECK 4: balance
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
      if (!balance) {
        setAmountErrMsg(TransactionError.TOKEN_NOT_ENOUGH);
        return { status: false };
      }
      if (type === 'token') {
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
        if (ZERO.plus(amount).isGreaterThan(balance)) {
          setAmountErrMsg(TransactionError.NFT_NOT_ENOUGH);
          return { status: false };
        }
      } else {
        return { status: false };
      }

      // CHECK 5: transfer limit
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
        // TODO-SA modal
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
        try {
          const { withdrawInfo } = await withdrawPreview({
            symbol: tokenInfo.symbol,
            address: toAccount.address,
            chainId: tokenInfo.chainId,
            amount,
            network: targetNetwork?.network || '',
          });
          console.log('withdrawInfo result', withdrawInfo);
          networkFee = withdrawInfo?.aelfTransactionFee;
          const maxAmount = Number(withdrawInfo?.maxAmount);
          const minAmount = Number(withdrawInfo?.minAmount);
          transactionFee = withdrawInfo.transactionFee;
          transactionUnit = withdrawInfo.transactionUnit;
          const isEtransferCrossInLimit = Number(amount) >= minAmount && Number(amount) <= maxAmount;

          if (isEtransferCrossInLimit) {
            receiveAmount = withdrawInfo?.receiveAmount;
            receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
            transferType = TransferType.E_TRANSFER;
            setNetworkFee(networkFee);
            setNetworkFeeUnit(networkFeeUnit);
            setReceiveAmount(receiveAmount);
            setReceiveAmountUsd(receiveAmountUsd);
            setTransactionFee(transactionFee);
            setTransactionUnit(transactionUnit);
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
            setAmountErrMsg(getLimitTips(tokenInfo.label || tokenInfo.symbol, minAmount, maxAmount));
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
          const _tokenInfo = getTokenConfig(tokenInfo.symbol);
          const bridge = new EBridge({
            fromChainInfo,
            toChainInfo,
            tokenInfo: _tokenInfo,
          });

          receiveAmount = amount;
          receiveAmountUsd = ZERO.plus(amount).times(tokenPriceObject[tokenInfo.symbol]).toString();

          // fee
          const f = await bridge.getELFFee();

          // limit
          const limit = await bridge.getLimit();
          const targetLimit = getSmallerValue(limit.remain, limit.currentCapacity);
          if (limit.isEnable && timesDecimals(amount, tokenInfo.decimals || '0').isGreaterThan(targetLimit)) {
            console.log('checkCanPreview 16');
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

      // CHECK 6.3 SameChain or CrossChain in aelf
      if (isCrossChain(toAccount.address, chainId) && CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenSymbol)) {
        let isEtransferCrossInLimit = false;

        try {
          const { withdrawInfo } = await withdrawPreview({
            symbol: tokenInfo.symbol,
            address: toAccount.address,
            chainId: tokenInfo.chainId,
            amount,
            network: getAddressChainId(toAccount.address, 'AELF') || 'AELF',
          });

          transactionFee = withdrawInfo?.aelfTransactionFee;
          const maxAmount = Number(withdrawInfo?.maxAmount);
          const minAmount = Number(withdrawInfo?.minAmount);
          transactionFee = withdrawInfo.transactionFee;
          transactionUnit = withdrawInfo.transactionUnit;
          isEtransferCrossInLimit = Number(amount) >= minAmount && Number(amount) <= maxAmount;

          // eTransfer
          if (isEtransferCrossInLimit) {
            receiveAmount = withdrawInfo?.receiveAmount;
            receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
            transferType = TransferType.E_TRANSFER;
          }
        } catch (error) {
          console.log('isEtransferCrossInLimit', error);
          isEtransferCrossInLimit = false;
        }
        // GENERAL_CROSS_CHAIN
        if (!isEtransferCrossInLimit) {
          transferType = TransferType.GENERAL_CROSS_CHAIN;
          networkFee = (await getTransactionFee()) || '0';
          networkFeeUnit = 'ELF';
        }
      } else {
        networkFeeUnit = 'ELF';
        transferType = isCrossChain(toAccount.address, chainId)
          ? TransferType.GENERAL_CROSS_CHAIN
          : TransferType.GENERAL_SAME_CHAIN;
        const fee = await getTransactionFee();

        if (fee) {
          setTxFee(fee);
          networkFee = fee;
        } else {
          setAmountErrMsg(TransactionError.FEE_NOT_ENOUGH);
          return { status: false };
        }
      }

      setNetworkFee(networkFee);
      setNetworkFeeUnit(networkFeeUnit);
      setReceiveAmount(receiveAmount);
      setReceiveAmountUsd(receiveAmountUsd);
      setTransactionFee(transactionFee);
      setTransactionUnit(transactionUnit);
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
    toAccount,
    chainId,
    checkManagerSyncState,
    checkSecurity,
    currentNetwork.walletType,
    caAddress,
    type,
    checkLimit,
    amount,
    stage,
    handleOneTimeApproval,
    warning,
    recommendETransfer,
    recommendEBridge,
    getTransactionFee,
    symbol,
    defaultToken.symbol,
    defaultToken.decimals,
    crossChainFee,
    withdrawPreview,
    targetNetwork,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    tokenPriceObject,
  ]);
  const toPreviewStage = useCallback(async () => {
    const result = await previewCheck();

    if (!result?.status) {
      return;
    }
    if (transferType === TransferType.E_BRIDGE) {
      return setCurModalTipKey(ModalTipKeyEnum.eBridge);
    }
    setStage(SendStage.Preview);
  }, [previewCheck, transferType]);

  const sendHandler = useCallback(async (): Promise<string | void> => {
    if (!oneTimeApprovalList.current || oneTimeApprovalList.current.length === 0) {
      if (!tokenInfo) throw 'No Symbol info';
      setBtnLoading(true);
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
          setBtnLoading(false);
          return ExceedLimit;
        } else {
          await sendTransfer();
        }
      } catch (error) {
        setBtnLoading(false);
        const msg = handleErrorMessage(error);
        singleMessage.error(msg);
        return;
      }
    } else {
      await sendTransfer();
    }
  }, [amount, balance, checkLimit, handleOneTimeApproval, sendTransfer, stage, toAccount, tokenInfo]);

  const adsCheckWarningRender = useMemo(() => {
    if (!warning) return null;
    const _tip = AdsCheckWarningTip[warning];
    return <CommonPromptCard type={_tip.type} description={_tip.desc} />;
  }, [warning]);

  const adsInputBtnTitle = useMemo(() => {
    if (
      (!toAccount.address ||
        !isCheckAddressFinish ||
        warning === WarningKey.MAKE_SURE_SUPPORT_PLATFORM ||
        warning === WarningKey.INVALID_ADDRESS ||
        warning === WarningKey.SAME_ADDRESS) &&
      inputStep === InputStepEnum.input
    ) {
      return '';
    }
    if (inputStep === InputStepEnum.input && warning === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF)
      return 'Confirm and continue';
    return 'Next';
  }, [inputStep, isCheckAddressFinish, toAccount.address, warning]);

  const btnDisabled = useMemo(() => {
    if (inputStep === InputStepEnum.input) {
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
  }, [amount, amountErrMsg, inputStep, toAccount?.address, warning]);

  const StageObj: TypeStageObj = useMemo(
    () => ({
      [SendStage.Address]: {
        btnText: adsInputBtnTitle,
        handler: () => {
          if (warning === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && addressType === AddressTypeEnum.EXCHANGE) {
            return setCurModalTipKey(ModalTipKeyEnum.dAppChainToExchange);
          }
          if (warning === WarningKey.CROSS_CHAIN) {
            return setCurModalTipKey(ModalTipKeyEnum.crossChain);
          }
          setStage(SendStage.Amount);
          setInputStep(InputStepEnum.show);
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
      [SendStage.Amount]: {
        btnText: amountErrMsg || 'Preview',
        handler: toPreviewStage,
        backFun: () => {
          setStage(SendStage.Address);
          setAmount('');
          setUSDAmount('');
          setAmountErrMsg('');
          setInputStep(InputStepEnum.input);
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
        btnText: 'Send',
        handler: sendHandler,
        backFun: () => {
          setStage(SendStage.Amount);
          oneTimeApprovalList.current = [];
        },
        element: (
          <SendPreview
            toAccount={toAccount}
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
      adsInputBtnTitle,
      toAccount,
      isCheckAddressFinish,
      adsCheckWarningRender,
      warning,
      addressType,
      chainList,
      tokenInfo,
      toPreviewStage,
      type,
      balance,
      onClickMax,
      amount,
      usdAmount,
      amountErrMsg,
      sendHandler,
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
              title={`Send ${type === SendPageTypeEnum.token ? tokenInfo.label ?? symbol : ''}`}
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
                caAddress={caAddress}
                toAccount={toAccount}
                setToAccount={setToAccount}
                sendType={type as SendPageTypeEnum}
                step={inputStep}
                setStep={setInputStep}
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
            <div className="stage-ele flex-column flex-1">{StageObj[stage].element}</div>
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
        <GuardianApproveModal
          open={openGuardiansApprove}
          targetChainId={tokenInfo.chainId}
          operationType={OperationTypeEnum.transferApprove}
          onClose={onCloseGuardianApprove}
          getApproveRes={getOneTimeApproveRes}
          operationDetails={getOperationDetails(OperationTypeEnum.transferApprove, {
            symbol: tokenInfo?.symbol,
            amount,
            toAddress: toAccount.address,
            caHash: wallet.caHash,
            verifyManagerAddress: wallet.address,
          })}
        />
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
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [
    StageObj,
    amount,
    btnDisabled,
    btnLoading,
    caAddress,
    clickHelp,
    curModalTipKey,
    disclaimerOpen,
    getOneTimeApproveRes,
    inputStep,
    isCheckAddressFinish,
    isPrompt,
    modalTipContent,
    navigate,
    onCloseGuardianApprove,
    openGuardiansApprove,
    stage,
    symbol,
    toAccount,
    tokenInfo,
    type,
    wallet.address,
    wallet.caHash,
    warning,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
