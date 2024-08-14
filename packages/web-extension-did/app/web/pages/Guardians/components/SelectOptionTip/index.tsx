import { useCallback } from 'react';
import { Select } from 'antd';
import CustomSvg from 'components/CustomSvg';
import './index.less';

const { Option } = Select;

export default function OptionTip() {
  const onClickZKLogin = useCallback(() => {
    // TODO zklogin link
    const openWinder = window.open('', '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, []);

  return (
    <Option disabled key="option-tip" className="guardian-select-option-tip">
      <div className="custom-option-tip flex-row-center">
        <CustomSvg type="Warning" />
        <div>
          <span>
            {`Used Verifiers other than ZKlogin cannot be selected. Only Google and Apple type accounts can choose ZKlogin as Verifier. Learn more about`}
          </span>
          <span onClick={onClickZKLogin} className="click-container">{` ZKlogin`}</span>
        </div>
      </div>
    </Option>
  );
}
