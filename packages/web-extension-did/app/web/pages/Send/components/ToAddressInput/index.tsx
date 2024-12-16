import { useCallback } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
// import CircleLoading from 'components/CircleLoading';
import { Input } from 'antd';
import './index.less';

export enum InputStepEnum {
  input = 'input',
  show = 'show',
}

export default function ToAddressInput() {
  const renderAddressShow = useCallback(() => {
    return (
      <div className="flex-row-center address-show">
        <div className="label">{`To: `}</div>
        <div className="flex-row-center">
          <span>
            {`Olivia Ong`}
            <span className="gary-color">{`(ELF_22FM...xhWb_tDVV)`}</span>
          </span>
          {/* <span>{`ELF_22FM...xhWb_AELF`}</span> */}
          <CustomSvgV3 className="edit-thin-icon cursor-pointer" type="edit thin" />
        </div>
      </div>
    );
  }, []);

  // TODO-SA
  console.log(renderAddressShow);
  const renderAddressInput = useCallback(() => {
    return (
      <div className="flex-between-center address-input">
        <div className="label">{`To:`}</div>
        <div className="flex-1 flex-row-center input-content">
          <Input.TextArea className="address-textarea" placeholder="Address" autoSize={{ minRows: 1, maxRows: 3 }} />
        </div>
        <div className="flex-row-center input-icon">
          <CustomSvgV3 className="cursor-pointer" type="close-circle" />
          {/* <CircleLoading width={24} height={24} /> */}
          <CustomSvgV3 className="status-icon" type="error" />
          {/* <CustomSvgV3 className="status-icon" type="check" /> */}
        </div>
      </div>
    );
  }, []);

  return (
    <div className="to-address-input-wrap">
      <div className="address-input-container">{renderAddressInput()}</div>
      <div className="paste-container">
        <span className="show-text">{`Enter or `}</span>
        <span className="paste-text cursor-pointer">{`paste a wallet address`}</span>
      </div>
    </div>
  );
}
