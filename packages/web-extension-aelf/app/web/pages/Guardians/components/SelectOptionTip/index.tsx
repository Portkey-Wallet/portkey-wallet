import { Select } from 'antd';
import CustomSvg from 'components/CustomSvg';
import './index.less';

const { Option } = Select;

export default function OptionTip() {
  // zklogin url is not ready
  // const onClickZKLogin = useCallback(() => {
  //   const openWinder = window.open('', '_blank');
  //   if (openWinder) {
  //     openWinder.opener = null;
  //   }
  // }, []);

  return (
    <Option disabled key="option-tip" className="guardian-select-option-tip">
      <div className="custom-option-tip flex">
        <CustomSvg type="Warning" />
        <div>
          <span>
            {`Except for zkLogin, used verifiers cannot be selected. To choose ZkLogin, the guardian type must be either a Google account or an Apple ID.`}
          </span>
          {/* <span>
            {` Learn more about`}
            <span onClick={onClickZKLogin} className="click-container">{` ZKlogin`}</span>
          </span> */}
        </div>
      </div>
    </Option>
  );
}
