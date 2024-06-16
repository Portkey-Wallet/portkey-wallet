import CommonHeader from 'components/CommonHeader';
import { useLocation, useNavigate } from 'react-router';
import RadioTab from 'pages/components/RadioTab';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Switch } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import CustomSvg from 'components/CustomSvg';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import clsx from 'clsx';
import PromptFrame from 'pages/components/PromptFrame';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import SelectAsset from '../components/SelectAsset';
import { DEFAULT_GIFT_TOKEN, TDVV_CHAIN_GIFT_TOKEN, TDVW_CHAIN_GIFT_TOKEN, chianInfoShow, getPrice } from '../utils';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ZERO } from '@portkey-wallet/im-ui-web';
import { divDecimals, formatAmountShow, formatAmountUSDShow, timesDecimals } from '@portkey-wallet/utils/converter';
import ConfirmGift from '../components/ConfirmGift';
import { useGetCryptoGiftConfig, useSendCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { RedPackageTypeEnum } from '@portkey-wallet/im/types/redPackage';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import getSeed from 'utils/getSeed';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCalculateCryptoGiftFee } from 'hooks/useCalculateCryptoGiftFee';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { useCheckSecurity } from 'hooks/useSecurity';
import AllowanceModal from 'pages/components/setAllowanceModal';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCheckAllowance } from 'hooks/useCheckAllowance';
import { IGuardiansApproved } from '@portkey/did-ui-react';
import { isNFT } from '@portkey-wallet/utils/token';
import './index.less';
import googleAnalytics from 'utils/googleAnalytics';

export const Gift_TAB: {
  value: RedPackageTypeEnum;
  label: string;
}[] = [
  {
    value: RedPackageTypeEnum.RANDOM,
    label: 'Random',
  },
  {
    value: RedPackageTypeEnum.FIXED,
    label: 'Fixed',
  },
];

export default function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPrompt } = useCommonState();
  const formatAmountInUsdShow = useAmountInUsdShow();
  const [curTab, setCurTab] = useState(RedPackageTypeEnum.RANDOM);
  const [quantity, setQuantity] = useState<string>();
  const [quantityErr, setQuantityErr] = useState('');
  const [amount, setAmount] = useState<string>();
  const [amountErr, setAmountErr] = useState('');
  const [amountUsdShow, setAmountUsdShow] = useState('$0');
  const [token, setToken] = useState<ICryptoBoxAssetItemType>(DEFAULT_GIFT_TOKEN);
  const isMainnet = useIsMainnet();
  const otherChainToken = useRef<ICryptoBoxAssetItemType | undefined>(
    isMainnet ? TDVV_CHAIN_GIFT_TOKEN : TDVW_CHAIN_GIFT_TOKEN,
  );
  const [memo, setMemo] = useState<string>();
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [newUserFlag, setNewUserFlag] = useState<boolean>(true);
  const [selectAssetOpen, setSelectAssetOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [allowanceOpen, setAllowanceOpen] = useState<boolean>(false);
  const sendCryptoGift = useSendCryptoGift();
  const { init, getCryptoGiftContractAddress } = useGetCryptoGiftConfig();
  const allChainList = useCurrentChainList();
  const chainInfo = useMemo(
    () => allChainList?.find((item) => item.chainId === token.chainId),
    [allChainList, token.chainId],
  );
  const currentNetwork = useCurrentNetworkInfo();
  const wallet = useCurrentWalletInfo();
  const [balance, setBalance] = useState('--');
  const [txFee, setTxFee] = useState('--');
  const [showTransfer, setShowTransfer] = useState(false);
  const checkManagerSyncState = useCheckManagerSyncState();
  const checkSecurity = useCheckSecurity();
  const originChainId = useOriginChainId();
  const checkAllowance = useCheckAllowance();
  const privateKeyRef = useRef<string>('');
  const [btnLoading, setBtnLoading] = useState(false);
  useFetchTxFee();
  const { redPackage: cryptoGiftFee } = useGetTxFee(token.chainId);
  const getCalculateCryptoGiftFee = useCalculateCryptoGiftFee();
  const balanceInUsd = useMemo(() => {
    if (balance === '--') return '--';
    if (!tokenPrice) return '';
    return formatAmountUSDShow(ZERO.plus(balance).times(tokenPrice));
  }, [balance, tokenPrice]);
  const txFeeInUsd = useMemo(
    () => (txFee === '--' ? '--' : formatAmountInUsdShow(txFee, 0, DEFAULT_TOKEN.symbol)),
    [formatAmountInUsdShow, txFee],
  );
  const loadRef = useRef<boolean>(false);
  const { setLoading } = useLoading();

  useEffectOnce(() => {
    googleAnalytics.firePageViewEvent('CryptoGift-Create', location.pathname);
  });

  // totalAmount
  const totalAmount = useMemo(() => {
    if (!(amount && quantity)) return 0;
    return curTab === RedPackageTypeEnum.RANDOM ? amount : ZERO.plus(quantity).times(amount).toFixed();
  }, [amount, curTab, quantity]);
  const totalAmountShow = useMemo(() => {
    if (!totalAmount) return '0.00';
    return formatAmountShow(totalAmount, token.decimals);
  }, [token.decimals, totalAmount]);
  const totalAmountUsdShow = useMemo(() => {
    if (!(totalAmount && tokenPrice)) return '';
    return formatAmountUSDShow(ZERO.plus(totalAmount).times(tokenPrice));
  }, [tokenPrice, totalAmount]);

  const getInitState = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) return;
    privateKeyRef.current = privateKey;
  }, []);

  useEffectOnce(() => {
    init();
    getInitState();
  });

  const updateAmountUsdShow = useCallback(async () => {
    let _usd = '';
    const _price = await getPrice(token.symbol);
    setTokenPrice(_price);
    if (_price) {
      _usd = formatAmountUSDShow(ZERO.plus(amount ?? 0).times(_price));
    }
    setAmountUsdShow(_usd);
  }, [amount, token.symbol]);
  useEffect(() => {
    updateAmountUsdShow();
  }, [updateAmountUsdShow]);

  // check show buy btn
  const cardShowFn = useMemo(
    () => checkEnabledFunctionalTypes(token.symbol, token.chainId === MAIN_CHAIN_ID),
    [token.chainId, token.symbol],
  );
  const { isBuySectionShow } = useExtensionRampEntryShow();
  const isShowBuyBtn = useMemo(
    () => (balance === '--' || ZERO.plus(balance).lt(totalAmount)) && cardShowFn.buy && isBuySectionShow,
    [balance, cardShowFn.buy, isBuySectionShow, totalAmount],
  );

  // check show transfer
  const checkShowTransfer = useCallback(async () => {
    if (!otherChainToken.current || txFee == '--') {
      setShowTransfer(false);
      return;
    }
    if (ZERO.plus(balance).gte(totalAmount)) {
      setShowTransfer(false);
      return;
    }
    try {
      const otherChainInfo = allChainList?.find((item) => item.chainId !== token.chainId);
      if (!otherChainInfo) {
        setShowTransfer(false);
        return;
      }
      const tokenContract = new ExtensionContractBasic({
        privateKey: privateKeyRef.current,
        rpcUrl: otherChainInfo.endPoint,
        contractAddress: otherChainToken.current.tokenContractAddress ?? otherChainToken.current.address,
      });
      const _res = await tokenContract.callViewMethod('GetBalance', {
        symbol: token.symbol,
        owner: wallet?.caAddress ?? '',
      });
      const _balance = _res.data.balance;

      setShowTransfer(divDecimals(_balance, token.decimals).gte(totalAmount));
    } catch (error) {
      console.log('===get other chain balance error', error);
      setShowTransfer(false);
    }
  }, [allChainList, balance, token.chainId, token.decimals, token.symbol, totalAmount, txFee, wallet?.caAddress]);
  useEffect(() => {
    checkShowTransfer();
  }, [checkShowTransfer]);

  const changeCurTab = useCallback((target: RedPackageTypeEnum) => {
    setCurTab(target);
    setQuantity(undefined);
    setAmount(undefined);
    setToken(DEFAULT_GIFT_TOKEN);
    setMemo(undefined);
    setNewUserFlag(true);
  }, []);

  const updateTokenBalance = useCallback(async () => {
    if (!chainInfo) throw 'chainInfo not exist';
    try {
      const tokenContract = new ExtensionContractBasic({
        privateKey: privateKeyRef.current,
        rpcUrl: chainInfo.endPoint,
        contractAddress: token.tokenContractAddress ?? token.address,
      });
      const _res = await tokenContract.callViewMethod('GetBalance', {
        symbol: token.symbol,
        owner: wallet?.caAddress ?? '',
      });
      const _balance = _res.data.balance;
      setBalance(divDecimals(_balance, token.decimals).toFixed());
    } catch (error) {
      console.log('===updateTokenBalance error', error);
      setBalance('--');
    }
  }, [chainInfo, token.address, token.decimals, token.symbol, token.tokenContractAddress, wallet?.caAddress]);
  useEffect(() => {
    updateTokenBalance();
  }, [updateTokenBalance]);

  const updateTxFee = useCallback(async () => {
    try {
      if (!totalAmount) throw 'amount is invalid';
      if (!chainInfo) throw 'can not find chainInfo';
      const _fee = await getCalculateCryptoGiftFee({
        amount: totalAmount,
        chainInfo,
        caAddress: wallet?.caAddress ?? '',
        cryptoGiftFee: cryptoGiftFee,
        token,
      });
      setTxFee(divDecimals(_fee, DEFAULT_TOKEN.decimals).toFixed());
    } catch (error) {
      console.log('getTransferFee error', error);
      setTxFee('--');
    }
  }, [chainInfo, cryptoGiftFee, getCalculateCryptoGiftFee, token, totalAmount, wallet]);
  useEffect(() => {
    updateTxFee();
  }, [updateTxFee]);

  const handleSetAllowance = useCallback(
    async ({
      symbol,
      amount,
      guardiansApproved,
    }: {
      symbol: string;
      amount: string | number;
      guardiansApproved: IGuardiansApproved[];
    }) => {
      if (loadRef.current) return;
      const spender = getCryptoGiftContractAddress(token.chainId);
      if (!(spender && chainInfo)) {
        setAllowanceOpen(false);
        setConfirmOpen(false);
        return;
      }

      const caContract = new ExtensionContractBasic({
        privateKey: privateKeyRef.current,
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.caContractAddress,
      });
      try {
        const options = {
          caHash: wallet.caHash,
          spender: spender,
          symbol,
          amount,
          guardiansApproved,
        };
        loadRef.current = true;
        setLoading(true);
        console.log('ManagerApprove==options', options);
        await caContract.callSendMethod('ManagerApprove', '', options, {
          onMethod: 'receipt',
        });
      } catch (error) {
        setAllowanceOpen(false);
        setLoading(false);
        console.log('===ManagerApprove error', error);
        return;
      } finally {
        loadRef.current = false;
      }

      try {
        const id = await sendCryptoGift({
          totalAmount: timesDecimals(totalAmount, token.decimals).toFixed(),
          type: curTab,
          count: Number(quantity),
          memo: memo?.trim() || RED_PACKAGE_DEFAULT_MEMO,
          caContract,
          token,
          isNewUsersOnly: newUserFlag,
        });
        navigate('/crypto-gifts/success', { state: { id } });
      } catch (error) {
        console.log('===sendCryptoGift error', error);
        singleMessage.error(handleErrorMessage(error, 'send crypto gift error'));
        setAllowanceOpen(false);
        setConfirmOpen(false);
      } finally {
        setLoading(false);
        loadRef.current = false;
      }
    },
    [
      chainInfo,
      curTab,
      getCryptoGiftContractAddress,
      memo,
      navigate,
      newUserFlag,
      quantity,
      sendCryptoGift,
      setLoading,
      token,
      totalAmount,
      wallet.caHash,
    ],
  );

  const handleConfirm = useCallback(async () => {
    try {
      if (!chainInfo) throw 'get chainInfo error';
      const spender = getCryptoGiftContractAddress(token.chainId);
      if (!spender) throw 'can not get spender';

      const _check = await checkAllowance({
        tokenInfo: {
          chainId: token.chainId,
          symbol: token.symbol,
          decimals: Number(token.decimals),
          alias: token.alias,
          contractAddress: token.tokenContractAddress ?? token.address,
        },
        spender,
        bigAmount: timesDecimals(totalAmount, token.decimals).toFixed(),
        chainInfo,
        caAddress: wallet.caAddress ?? '',
      });

      if (!_check) {
        setAllowanceOpen(true);
        return;
      }

      const caContract = new ExtensionContractBasic({
        privateKey: privateKeyRef.current,
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.caContractAddress,
      });

      const id = await sendCryptoGift({
        totalAmount: timesDecimals(totalAmount, token.decimals).toFixed(),
        type: curTab,
        count: Number(quantity),
        memo: memo?.trim() || RED_PACKAGE_DEFAULT_MEMO,
        caContract,
        token,
        isNewUsersOnly: newUserFlag,
      });
      navigate('/crypto-gifts/success', { state: { id } });
    } catch (error) {
      console.log('===sendCryptoGift error', error);
      singleMessage.error(handleErrorMessage(error, 'send crypto gift error'));
      setConfirmOpen(false);
    }
  }, [
    chainInfo,
    getCryptoGiftContractAddress,
    token,
    checkAllowance,
    totalAmount,
    wallet.caAddress,
    sendCryptoGift,
    curTab,
    quantity,
    memo,
    newUserFlag,
    navigate,
  ]);

  const handlePreviewCheck = useCallback(async () => {
    try {
      if (ZERO.plus(quantity ?? '').lte(ZERO)) {
        setQuantityErr('Please input valid quantity');
        return;
      }
      if (ZERO.plus(amount ?? '').lte(ZERO)) {
        setAmountErr('Please input valid amount');
        return;
      }
      if (token.decimals == 0 && curTab === RedPackageTypeEnum.RANDOM && ZERO.plus(amount ?? '').lt(quantity ?? '')) {
        setAmountErr(`At least 1 ${token.label ?? token.alias ?? token.symbol} for each crypto gift`);
        return;
      }
      setBtnLoading(true);
      // check manager sync
      const _isManagerSynced = await checkManagerSyncState(token.chainId);
      if (!_isManagerSynced) throw 'Synchronizing on-chain account information...';

      // check security
      const securityRes = await checkSecurity(token.chainId);
      if (!securityRes) throw 'wallet is not security';

      setConfirmOpen(true);
    } catch (error) {
      console.log('===handlePreviewCheck error', error);
      singleMessage.error(handleErrorMessage(error, 'send crypto gift error'));
    } finally {
      setBtnLoading(false);
    }
  }, [
    amount,
    checkManagerSyncState,
    checkSecurity,
    curTab,
    quantity,
    token.alias,
    token.chainId,
    token.decimals,
    token.label,
    token.symbol,
  ]);

  const mainContent = useMemo(
    () => (
      <div className={clsx('create-crypto-gift-page', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader title="Create Crypto Gifts" onLeftBack={() => navigate('/crypto-gifts')} />
        <div className="create-crypto-gift-body">
          <RadioTab
            className="create-crypto-gift-radio-tab"
            radioList={Gift_TAB}
            onChange={changeCurTab}
            activeValue={curTab}
            defaultValue={curTab}
          />
          <div className="crypto-gift-quality">
            <div className="gift-label">Quantity of Crypto Gifts</div>
            <Input
              type="text"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => {
                const _v = parseInputNumberChange(e.target.value, undefined, 0);
                setQuantityErr('');
                setQuantity(_v);
              }}
            />
            {quantityErr && <div className="msg-err">{quantityErr}</div>}
          </div>
          <div className="crypto-gift-amount">
            <div className="gift-label">{curTab === RedPackageTypeEnum.RANDOM ? 'Total Amount' : 'Amount Each'}</div>
            <Input
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                const _v = parseInputNumberChange(e.target.value, undefined, Number(token.decimals));
                setAmountErr('');
                setAmount(_v);
              }}
              addonAfter={
                <div className="gift-select-asset flex-row-center" onClick={() => setSelectAssetOpen(true)}>
                  <TokenImageDisplay
                    className="select-asset-icon"
                    width={24}
                    src={token.imageUrl}
                    symbol={token.symbol}
                  />
                  <div className="select-asset-token flex-1">
                    <div className="asset-token-symbol">{token.label ?? token.alias ?? token.symbol}</div>
                    <div className="asset-token-chain">{chianInfoShow(token.chainId)}</div>
                  </div>
                  <CustomSvg className="flex-center" type="DownDeposit" />
                </div>
              }
            />
            {amountErr && <div className="msg-err">{amountErr}</div>}
            <div className="amount-in-usd">{amountUsdShow}</div>
          </div>
          <div className="crypto-gift-wishes">
            <div className="gift-label">Wishes</div>
            <Input
              type="text"
              maxLength={80}
              placeholder="Best wishes!"
              value={memo}
              onChange={(e) => {
                setMemo(e.target.value);
              }}
            />
          </div>
          <div className="crypto-gift-new-users flex-between">
            <div className="gift-new-users-tip flex-column">
              <div className="tip-label">New Users Only</div>
              <div className="tip-content">
                Once enabled, only newly registered Portkey users can claim your crypto gift.
              </div>
            </div>
            <Switch
              checked={newUserFlag}
              onChange={(value) => setNewUserFlag(value)}
              className="gift-new-users-action"
            />
          </div>
          <div className="crypto-gift-total-amount">
            <span className="total-amount-number">{totalAmountShow}</span>
            <span className="total-amount-symbol">{token.label ?? token.alias ?? token.symbol}</span>
          </div>
          <Button
            className="crypto-gift-btn"
            disabled={!(quantity && amount && !quantityErr && !amountErr)}
            type="primary"
            loading={btnLoading}
            onClick={handlePreviewCheck}>
            Send Crypto Gift
          </Button>
          <div className="crypto-gift-tip">
            A crypto gift is valid for 24 hours. Unclaimed tokens/NFTs will be automatically returned to you upon
            expiration.
          </div>
        </div>
      </div>
    ),
    [
      isPrompt,
      changeCurTab,
      curTab,
      quantity,
      quantityErr,
      amount,
      token.imageUrl,
      token.symbol,
      token.label,
      token.alias,
      token.chainId,
      token.decimals,
      amountErr,
      amountUsdShow,
      memo,
      newUserFlag,
      totalAmountShow,
      btnLoading,
      handlePreviewCheck,
      navigate,
    ],
  );
  return (
    <>
      {isPrompt ? <PromptFrame content={mainContent} /> : mainContent}
      <SelectAsset
        open={selectAssetOpen}
        onClose={() => setSelectAssetOpen(false)}
        onSelectAsset={(item, other) => {
          setToken(item);
          setAmount(undefined);
          otherChainToken.current = other;
        }}
      />
      <ConfirmGift
        totalAmount={totalAmount}
        totalAmountShow={totalAmountShow}
        totalAmountUsdShow={totalAmountUsdShow}
        token={token}
        otherChainToken={otherChainToken.current}
        balance={balance}
        balanceInUsd={balanceInUsd}
        txFee={txFee}
        txFeeInUsd={txFeeInUsd}
        open={confirmOpen}
        isShowBuy={isShowBuyBtn}
        showTransfer={showTransfer}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
      <AllowanceModal
        open={allowanceOpen}
        originChainId={originChainId}
        targetChainId={token.chainId}
        caHash={wallet.caHash ?? ''}
        defaultIcon="RedPackageIcon"
        amount={timesDecimals(totalAmount, token.decimals).toFixed()}
        symbol={token.symbol}
        batchApproveNFT={isNFT(token.symbol)}
        networkType={currentNetwork.networkType}
        onCancel={() => setAllowanceOpen(false)}
        onFinish={handleSetAllowance}
      />
    </>
  );
}
