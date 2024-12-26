import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import CircleLoading from 'components/CircleLoading';
import { Input } from 'antd';
import { SendPageTypeEnum, ToAccount } from 'pages/Send';
import { IAssetToken, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import { Warning1Arr, WarningKey } from '@portkey-wallet/constants/constants-ca/send';
import { INetworkItem } from '../SelectNetwork';
import { useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { formatStr2EllipsisStr, getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
import clsx from 'clsx';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { getSendNetworkList } from 'pages/Send/utils';
import { ChainId } from '@portkey-wallet/types';
import { getAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import './index.less';

const { TextArea } = Input;

export enum InputStepEnum {
  input = 'input',
  show = 'show',
}

export interface IToAddressInputProps {
  sendType: SendPageTypeEnum;
  toAccount: ToAccount;
  setToAccount: Dispatch<SetStateAction<ToAccount>>;
  step: InputStepEnum;
  setStep: (step: InputStepEnum) => void;
  selectedToken?: IAssetToken | INftInfoType;
  caAddress: string;
  warning: WarningKey | undefined;
  checkFinish: boolean;
  setWarning: Dispatch<SetStateAction<WarningKey | undefined>>;
  setCheckFinish: Dispatch<SetStateAction<boolean>>;
  setSendAmount: Dispatch<SetStateAction<string>>;
  setSendUSDAmount: Dispatch<SetStateAction<string>>;
  setChainList: Dispatch<SetStateAction<INetworkItem[]>>;
}

export default function ToAddressInput({
  toAccount,
  setToAccount,
  step = InputStepEnum.input,
  selectedToken,
  caAddress,
  sendType,
  warning,
  checkFinish,
  setStep,
  setWarning,
  setCheckFinish,
  setSendAmount,
  setSendUSDAmount,
  setChainList,
}: IToAddressInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkedPass, setCheckedPass] = useState(false);
  const isValidChainId = useIsValidSuffix();
  const defaultToken = useDefaultToken();
  const isDangerWarning = useMemo(() => warning && Warning1Arr.includes(warning), [warning]);

  const changeValue = useCallback(
    (v: string) => {
      setToAccount({ name: '', address: v.trim() });
    },
    [setToAccount],
  );

  const clearValue = useCallback(() => {
    setToAccount({ name: '', address: '' });
    setStep(InputStepEnum.input);
    setSendAmount('');
    setSendUSDAmount('');
    setWarning(undefined);
  }, [setSendAmount, setSendUSDAmount, setStep, setToAccount, setWarning]);

  const onClickEdit = useCallback(() => {
    setStep(InputStepEnum.input);
    setCheckFinish(true);
    setCheckedPass(true);
  }, [setCheckFinish, setStep]);

  const pastValue = useCallback(async () => {
    try {
      const v = await navigator.clipboard.readText();
      !!v.trim() && setToAccount({ address: v });
    } catch (error) {
      console.warn('pastValue err', error);
    }
  }, [setToAccount]);

  const checkAddressByFE = useCallback(
    (v: string) => {
      if (!isDIDAelfAddress(v)) {
        return false;
      }

      // include chainId
      if (v.includes('_') && selectedToken) {
        const suffix = getAddressChainId(v, selectedToken?.chainId as ChainId);
        console.log('checkAddressByFE _', v);

        // same address
        if (isSameAddresses(getAelfAddress(caAddress), getAelfAddress(v)) && suffix === selectedToken?.chainId) {
          setCheckedPass(false);
          setWarning(WarningKey.SAME_ADDRESS);
        } else if (!isValidChainId(suffix)) {
          // invalid chainId
          setCheckedPass(false);
          setWarning(WarningKey.INVALID_ADDRESS);
        } else if (isCrossChain(v, (selectedToken?.chainId || MAIN_CHAIN_ID) as ChainId)) {
          // cross chain
          setCheckedPass(false);
          setWarning(WarningKey.CROSS_CHAIN);
        } else {
          setWarning(undefined);
          setCheckedPass(true);
        }
      } else {
        const isSameAddress = isSameAddresses(getAelfAddress(caAddress) || '', v);
        // same address
        if (
          selectedToken?.chainId === MAIN_CHAIN_ID &&
          !isSameAddress &&
          selectedToken?.symbol === defaultToken.symbol
        ) {
          setCheckedPass(false);
          setWarning(WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF);
        } else if (
          selectedToken?.chainId === MAIN_CHAIN_ID &&
          !isSameAddress &&
          selectedToken?.symbol !== defaultToken.symbol
        ) {
          setCheckedPass(true);
        } else if (selectedToken?.chainId === MAIN_CHAIN_ID && isSameAddress) {
          setCheckedPass(false);
          setWarning(WarningKey.SAME_ADDRESS);
        } else if (!isSameAddress && selectedToken?.symbol !== defaultToken.symbol) {
          setCheckedPass(true);
          // same chain transfer
          setToAccount((pre: any) => ({ ...pre, chainId: selectedToken?.chainId }));
        } else {
          setCheckedPass(false);
          setWarning(WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF);
        }
      }
      setCheckFinish(true);
      return true;
    },
    [caAddress, defaultToken.symbol, isValidChainId, selectedToken, setCheckFinish, setToAccount, setWarning],
  );

  const getNetworkList = useCallback(
    async (toAddress: string) => {
      if (!toAddress) {
        setWarning(undefined);
        setIsChecking(false);
        setCheckFinish(true);
        return;
      }

      try {
        setIsChecking(true);
        const { data, code } = await getSendNetworkList({
          symbol: selectedToken?.symbol || '',
          chainId: (selectedToken?.chainId || 'AELF') as ChainId,
          toAddress,
        });

        if (code === '40001') {
          setWarning(WarningKey.INVALID_ADDRESS);
        } else {
          setCheckedPass(true);
          setChainList(data.networkList);
          setWarning(WarningKey.MAKE_SURE_SUPPORT_PLATFORM);
        }
      } catch (error) {
        console.log('getNetworkList err', error);
        setWarning(WarningKey.INVALID_ADDRESS);
      } finally {
        setIsChecking(false);
        setCheckFinish(true);
      }
    },
    [selectedToken?.chainId, selectedToken?.symbol, setChainList, setCheckFinish, setWarning],
  );

  const checkAddress = useDebounceCallback(async () => {
    const FEPass = checkAddressByFE(toAccount.address);

    // when send nft other chain is not support
    if (!FEPass && sendType === SendPageTypeEnum.nft && !!toAccount.address) {
      setCheckFinish(true);
      return setWarning(WarningKey.INVALID_ADDRESS);
    }
    if (!FEPass) {
      await getNetworkList(toAccount.address);
    }
  }, [checkAddressByFE, getNetworkList, toAccount.address, sendType, setCheckFinish, setWarning]);

  useEffect(() => {
    checkAddress();
  }, [toAccount.address]);

  const renderAddressShow = useMemo(() => {
    return (
      <div className="flex-row-center address-show">
        <div className="label">{`To: `}</div>
        <div className="flex-row-center">
          {toAccount.name ? (
            <span>
              {toAccount.name}
              <span className="gary-color">{`(${formatStr2EllipsisStr(toAccount.address, 8)})`}</span>
            </span>
          ) : (
            <span>{formatStr2EllipsisStr(toAccount.address, 8)}</span>
          )}
          <CustomSvgV3 className="edit-thin-icon cursor-pointer" type="edit thin" onClick={onClickEdit} />
        </div>
      </div>
    );
  }, [onClickEdit, toAccount.address, toAccount.name]);

  const renderAddressInput = useMemo(() => {
    return (
      <div className="flex-between-center address-input">
        <div className="label">{`To:`}</div>
        <div className="flex-1 flex-row-center input-content">
          <TextArea
            className="address-textarea"
            placeholder="Address"
            autoSize={{ minRows: 1, maxRows: 3 }}
            value={toAccount.address}
            onChange={(e) => changeValue(e.target.value)}
          />
        </div>
        <div className="flex-row-center input-icon">
          {toAccount.address && !isChecking && (
            <CustomSvgV3 className="cursor-pointer" type="close-circle" onClick={clearValue} />
          )}
          {isChecking && <CircleLoading width={24} height={24} />}
          {toAccount.address && !isChecking && checkFinish && !checkedPass && (
            <CustomSvgV3 className={clsx('status-icon', isDangerWarning && 'danger-warning')} type="error" />
          )}
          {toAccount.address && !isChecking && checkFinish && checkedPass && (
            <CustomSvgV3 className="status-icon" type="check" />
          )}
        </div>
      </div>
    );
  }, [changeValue, checkFinish, checkedPass, clearValue, isChecking, isDangerWarning, toAccount.address]);

  return (
    <div className="address-input-wrap">
      <div className="address-input-container">
        {step === InputStepEnum.input ? renderAddressInput : renderAddressShow}
      </div>
      <div className="paste-container">
        <span className="show-text">{`Enter or `}</span>
        <span className="paste-text cursor-pointer" onClick={pastValue}>{`paste a wallet address`}</span>
      </div>
    </div>
  );
}
