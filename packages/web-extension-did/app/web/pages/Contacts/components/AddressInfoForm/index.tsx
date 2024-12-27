import { IEditContactItemFormType } from 'pages/Contacts/AddContact/types';
import './index.less';
import { FormInstance } from 'antd';
import { useCallback, useMemo } from 'react';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';

export type TChangeAddressInfoParams = Partial<IEditContactItemFormType['addressInfo']>;

interface AddressInfoFormProps {
  form: FormInstance<IEditContactItemFormType>;
  value?: IEditContactItemFormType['addressInfo'];
  onChange: (v: IEditContactItemFormType['addressInfo']) => void;
  handleNetworkModalState: (isShow: boolean) => void;
}
export default function AddressInfoForm({ form, value, onChange, handleNetworkModalState }: AddressInfoFormProps) {
  const { supportNetworkList } = useContactNetworkConfig();
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

  return (
    <div>
      <div onClick={() => handleNetworkModalState(true)}>{selectedNetworkInfo?.name}</div>
      {isAelfMainChain && (
        <div>
          <span
            onClick={() => onChangeAddressInfo({ isExchange: true })}
            style={{ color: value?.isExchange ? 'red' : 'white' }}>
            exchange
          </span>
          <span>====</span>
          <span
            onClick={() => onChangeAddressInfo({ isExchange: false })}
            style={{ color: value?.isExchange ? 'white' : 'red' }}>
            non-exchange
          </span>
        </div>
      )}
      <input
        type="text"
        value={value?.address || ''}
        onChange={(e) => onChangeAddressInfo({ address: e.target.value })}
      />
      <div className="paste-container">
        <span className="show-text">{`Enter or `}</span>
        <span className="paste-text cursor-pointer" onClick={pasteClipBoard}>{`paste a wallet address`}</span>
      </div>
    </div>
  );
}
