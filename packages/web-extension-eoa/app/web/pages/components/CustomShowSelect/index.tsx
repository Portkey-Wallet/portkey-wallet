import clsx from 'clsx';
import { Select, SelectProps } from 'antd';
import { OptionProps } from 'antd/lib/select';
import CustomSvg from 'components/CustomSvg';
import './index.less';

const { Option } = Select;
interface CustomSelectProps extends SelectProps {
  items?: OptionProps[];
  showInValue?: string;
}

export default function CustomSelect({ items = [], className, showInValue, ...props }: CustomSelectProps) {
  return (
    <Select
      optionLabelProp="name"
      className={clsx('custom-show-select', className)}
      size="large"
      popupClassName="custom-select-popup"
      {...props}>
      {items.map((op) => (
        <Option
          key={op.value}
          {...op}
          name={
            <div className="flex-between-center custom-value-show">
              <span className="custom-label">{showInValue}</span>
              <span className="value-show">{op.children}</span>
            </div>
          }>
          <div className="custom-select-option">
            <div className="option-selected-icon-area">
              <CustomSvg type="Correct" />
            </div>
            <div className="option-label">{op.children}</div>
          </div>
        </Option>
      ))}
    </Select>
  );
}
