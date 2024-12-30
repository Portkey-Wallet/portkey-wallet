import { IEditContactItemFormType } from 'pages/Contacts/AddContact/types';
import './index.less';
import { FormInstance } from 'antd';
import { useCallback, useMemo } from 'react';
// import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { Input } from 'antd';
import { CommonModal } from '@portkey/did-ui-react';
import CommonHeader from 'components/CommonHeader';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
import { useEffectOnce } from '@portkey-wallet/hooks';

export type TChangeAddressInfoParams = Partial<IEditContactItemFormType['addressInfo']>;
// packages/web-extension-did/app/web/pages/components/CustomSelect/index.tsx

interface AddressInfoFormProps {
  form?: FormInstance<IEditContactItemFormType>;
  value?: IEditContactItemFormType['addressInfo'];
  onChange: (v: IEditContactItemFormType['addressInfo']) => void;
  isNetworkModalOpen: boolean | undefined;
  handleNetworkModalState: (isShow: boolean) => void;
}
export default function AddressInfoForm({
  form,
  value,
  onChange,
  isNetworkModalOpen,
  handleNetworkModalState,
}: AddressInfoFormProps) {
  const { supportNetworkList, fetchContactSupportConfig } = useContactNetworkConfig();

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

  useEffectOnce(() => {
    fetchContactSupportConfig();
  });

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

      <CommonModal
        className="select-chain-modal"
        open={isNetworkModalOpen}
        onClose={() => handleNetworkModalState(false)}>
        <CommonHeader title={'Select network'} onLeftBackShowClose={true} />
        <div className="chain-content">
          {supportNetworkList.map((list) => {
            return (
              <div
                key={list.network}
                className="chain-list"
                onClick={() => {
                  onChangeAddressInfo({ network: list.network, chainId: list.chainId });
                  handleNetworkModalState(false);
                }}>
                <div className="chain-list-info">
                  <img src={list.imageUrl} width={24} height={24} alt="" />
                  <div>{list.name}</div>
                </div>
                {list.network == value?.network && <CustomSvgV3 type="selected" />}
              </div>
            );
          })}
        </div>
      </CommonModal>
    </div>
  );
}
