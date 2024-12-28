import { IEditContactItemFormType } from 'pages/Contacts/AddContact/types';
import './index.less';
import { FormInstance } from 'antd';
import { useCallback, useMemo } from 'react';
// import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { Input } from 'antd';

export type TChangeAddressInfoParams = Partial<IEditContactItemFormType['addressInfo']>;
// packages/web-extension-did/app/web/pages/components/CustomSelect/index.tsx

interface AddressInfoFormProps {
  form: FormInstance<IEditContactItemFormType>;
  value?: IEditContactItemFormType['addressInfo'];
  onChange: (v: IEditContactItemFormType['addressInfo']) => void;
  handleNetworkModalState: (isShow: boolean) => void;
}
export default function AddressInfoForm({ form, value, onChange, handleNetworkModalState }: AddressInfoFormProps) {
  // const { supportNetworkList } = useContactNetworkConfig();

  const supportNetworkList = [
    {
      network: 'aelf',
      name: 'aelf dAppChain',
      chainId: 'tDVW',
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/dappChain.png',
    },
    {
      network: 'aelf',
      name: 'aelf MainChain',
      chainId: 'AELF',
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/mainChain.png',
    },
    {
      network: 'SETH',
      name: 'Ethereum',
      chainId: null,
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/chain/ChainEthereum.png',
    },
    {
      network: 'TBSC',
      name: 'BNB Smart Chain',
      chainId: null,
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/chain/ChainBinance.png',
    },
    {
      network: 'Base',
      name: 'Base',
      chainId: null,
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/chain/ChainBase.png',
    },
  ];

  const selectedNetworkInfo = useMemo(
    () => supportNetworkList.find((ele) => ele.network === value?.network),
    [supportNetworkList, value?.network],
  );

  const isAelfMainChain = useMemo(() => value?.network === 'aelf', [value?.network]);

  const onChangeAddressInfo = useCallback(
    (v: TChangeAddressInfoParams) => {
      const _addressInfo = form?.getFieldValue('addressInfo');
      onChange({ ..._addressInfo, ...v });
    },
    [form, onChange],
  );

  const pasteClipBoard = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    onChangeAddressInfo({ address: text });
  }, [onChangeAddressInfo]);

  console.log('value', value, supportNetworkList);

  return (
    <div className="address-info-from">
      <div className="select-chain" onClick={() => handleNetworkModalState(true)}>
        <span>{selectedNetworkInfo?.name}</span>
        <CustomSvgV3 type="chevron_down" />
      </div>
      {isAelfMainChain && (
        <div className="address-info-tabs">
          <div
            onClick={() => onChangeAddressInfo({ isExchange: true })}
            className={`${value?.isExchange ? 'active' : ''}`}>
            {value?.isExchange && <CustomSvgV3 type="check" fillColor="@text-brand4" />}
            <span>exchange</span>
          </div>
          <div
            className={`${value?.isExchange ? '' : 'active'}`}
            onClick={() => onChangeAddressInfo({ isExchange: false })}>
            {!value?.isExchange && <CustomSvgV3 type="check" fillColor="@text-brand4" />}
            <span>non-exchange</span>
          </div>
        </div>
      )}
      <Input.TextArea
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        style={{ resize: 'none', height: 80 }}
        rows={3}
        maxLength={1000}
        value={value?.address || ''}
        onChange={(e) => onChangeAddressInfo({ address: e.target.value })}
      />
      {/* <input
        type="textarea"
        value={value?.address || ''}
        onChange={(e) => onChangeAddressInfo({ address: e.target.value })}
      /> */}
      <div className="paste-container">
        <span className="show-text">{`Enter or `}</span>
        <span className="paste-text cursor-pointer" onClick={pasteClipBoard}>{`paste a wallet address`}</span>
      </div>
    </div>
  );
}
