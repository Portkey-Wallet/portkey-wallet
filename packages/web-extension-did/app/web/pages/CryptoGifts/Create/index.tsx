import CommonHeader from 'components/CommonHeader';
import { useNavigate } from 'react-router';
import RadioTab from 'pages/components/RadioTab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Switch } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import CustomSvg from 'components/CustomSvg';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import PromptFrame from 'pages/components/PromptFrame';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import SelectAsset from '../components/SelectAsset';
import { DEFAULT_GIFT_TOKEN } from '../utils';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ZERO } from '@portkey-wallet/im-ui-web';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import ConfirmGift from '../components/ConfirmGift';
import { useSendCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { RedPackageTypeEnum } from '@portkey-wallet/im/types/redPackage';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import getSeed from 'utils/getSeed';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import getTransferFee from 'pages/Send/utils/getTransferFee';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import './index.less';

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
  const { isPrompt } = useCommonState();
  const amountInUsdShow = useAmountInUsdShow();
  const [curTab, setCurTab] = useState(RedPackageTypeEnum.RANDOM);
  const [quantity, setQuantity] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [token, setToken] = useState<ICryptoBoxAssetItemType>(DEFAULT_GIFT_TOKEN);
  const [memo, setMemo] = useState<string>();
  const [newUserFlag, setNewUserFlag] = useState<boolean>(true);
  const [selectAssetOpen, setSelectAssetOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const sendCryptoGift = useSendCryptoGift();
  const chainInfo = useCurrentChain(token.chainId);
  const currentNetwork = useCurrentNetworkInfo();
  const wallet = useCurrentWalletInfo();
  const [balance, setBalance] = useState('--');
  const [txFee, setTxFee] = useState('--');
  const balanceInUsd = useMemo(
    () => (balance === '--' ? '--' : amountInUsdShow(balance, 0, token.symbol)),
    [amountInUsdShow, balance, token.symbol],
  );
  const txFeeInUsd = useMemo(
    () => (txFee === '--' ? '--' : amountInUsdShow(txFee, DEFAULT_TOKEN.decimals, DEFAULT_TOKEN.symbol)),
    [amountInUsdShow, txFee],
  );
  const totalAmount = useMemo(() => {
    if (!(amount && quantity)) return 0;
    return curTab === RedPackageTypeEnum.RANDOM ? amount : ZERO.plus(quantity).times(amount).toFixed();
  }, [amount, curTab, quantity]);
  const totalAmountShow = useMemo(() => {
    if (!(amount && quantity)) return '0.00';
    return formatAmountShow(totalAmount, token.decimals);
  }, [amount, quantity, token.decimals, totalAmount]);
  const changeCurTab = useCallback((target: RedPackageTypeEnum) => {
    setCurTab(target);
    setQuantity(undefined);
    setAmount(undefined);
    setToken(DEFAULT_GIFT_TOKEN);
    setMemo(undefined);
    setNewUserFlag(true);
  }, []);
  const getTokenBalance = useCallback(async () => {
    if (!chainInfo) return;
    try {
      const result = await getBalance({
        rpcUrl: chainInfo.endPoint,
        address: token.address,
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: wallet?.[token.chainId]?.caAddress ?? '',
          symbol: token.symbol,
        },
      });
      const _balance = result.result.balance;
      setBalance(divDecimals(_balance, token.decimals).toFixed());
    } catch (error) {
      setBalance('--');
    }
  }, [chainInfo, currentNetwork.walletType, token.address, token.chainId, token.decimals, token.symbol, wallet]);
  const getTxFee = useCallback(async () => {
    try {
      if (!chainInfo) throw 'can not find chainInfo';
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Invalid Private Key';
      // const _fee = await getTransferFee({
      //   caAddress: wallet?.[token.chainId]?.caAddress ?? '',
      //   managerAddress: wallet.address,
      //   toAddress: toAccount?.address, // ???
      //   privateKey,
      //   chainInfo: chainInfo,
      //   chainType: currentNetwork.walletType,
      //   token: {
      //     ...token,
      //     decimals: Number(token.decimals),
      //   },
      //   caHash: wallet.caHash as string,
      //   amount: timesDecimals(totalAmount, token.decimals).toFixed(),
      // });
      // setTxFee(_fee);
    } catch (error) {
      console.log('===getTransferFee error', error);
      setTxFee('--');
    }
  }, [chainInfo]);
  const handleConfirm = useCallback(async () => {
    try {
      if (!chainInfo) throw 'get chainInfo error';
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'get privateKey error';
      const caContract = new ExtensionContractBasic({
        privateKey,
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.caContractAddress,
      });

      sendCryptoGift({
        totalAmount: totalAmountShow,
        type: curTab,
        count: Number(quantity),
        memo: memo ?? 'Best wishes!',
        caContract,
        token,
        isNewUsersOnly: newUserFlag,
      });
    } catch (error) {
      console.log('===sendCryptoGift error', error);
      singleMessage.error(handleErrorMessage(error, 'send crypto gift error'));
    }
  }, [chainInfo, curTab, memo, newUserFlag, quantity, sendCryptoGift, token, totalAmountShow]);
  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);
  useEffect(() => {
    getTxFee();
  }, [getTxFee]);
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
                setQuantity(_v);
              }}
            />
          </div>
          <div className="crypto-gift-amount">
            <div className="gift-label">{curTab === RedPackageTypeEnum.RANDOM ? 'Total Amount' : 'Amount Each'}</div>
            <Input
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                const _v = parseInputNumberChange(e.target.value, undefined, 8);
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
                  <div className="select-asset-symbol flex-1">{token.label ?? token.symbol}</div>
                  <CustomSvg className="flex-center" type="DownDeposit" />
                </div>
              }
            />
            <div className="amount-in-usd">{amountInUsdShow(amount ?? 0, 0, token.symbol)}</div>
          </div>
          <div className="crypto-gift-wishes">
            <div className="gift-label">Wishes</div>
            <Input
              type="text"
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
              <div className="tip-content">Once enabled, only new Portkey users can receive your crypto gift.</div>
            </div>
            <Switch
              checked={newUserFlag}
              onChange={(value) => setNewUserFlag(value)}
              className="gift-new-users-action"
            />
          </div>
          <div className="crypto-gift-total-amount">
            <span className="total-amount-number">{totalAmountShow ?? '0.00'}</span>
            <span className="total-amount-symbol">{token.label ?? token.symbol}</span>
          </div>
          <Button
            className="crypto-gift-btn"
            disabled={!(quantity && amount)}
            type="primary"
            onClick={() => setConfirmOpen(true)}>
            Send Crypto Gifts
          </Button>
          <div className="crypto-gift-tip">
            A crypto gift is valid for 24 hours. Unclaimed tokens/NFTs will be automatically returned to you upon
            expiration.
          </div>
        </div>
      </div>
    ),
    [
      amount,
      amountInUsdShow,
      changeCurTab,
      curTab,
      isPrompt,
      navigate,
      newUserFlag,
      quantity,
      token.imageUrl,
      token.label,
      token.symbol,
      totalAmountShow,
      memo,
    ],
  );
  return (
    <>
      {isPrompt ? <PromptFrame content={mainContent} /> : mainContent}
      <SelectAsset
        open={selectAssetOpen}
        onClose={() => setSelectAssetOpen(false)}
        onSelectAsset={(item) => setToken(item)}
      />
      <ConfirmGift
        totalAmount={totalAmountShow}
        totalAmountInUsd={amountInUsdShow(totalAmount, 0, token.symbol)}
        token={token}
        balance={balance}
        balanceInUsd={balanceInUsd}
        txFee={txFee}
        txFeeInUsd={txFeeInUsd}
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
