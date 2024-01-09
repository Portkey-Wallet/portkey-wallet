import { Select } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { verifierUsedTip } from '@portkey-wallet/constants/constants-ca/guardian';
import './index.less';

const { Option } = Select;

export default function OptionTip() {
  return (
    <Option disabled key="option-tip" className="guardian-select-option-tip">
      <div className="custom-option-tip flex-row-center">
        <CustomSvg type="Warning" />
        <div>{verifierUsedTip}</div>
      </div>
    </Option>
  );
}
