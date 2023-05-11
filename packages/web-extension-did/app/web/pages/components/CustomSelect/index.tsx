import clsx from 'clsx';
import { Select, SelectProps } from 'antd';
import { OptionProps } from 'antd/lib/select';
import CustomSvg from 'components/CustomSvg';
import './index.less';

const { Option } = Select;
interface CustomSelectProps extends SelectProps {
  items?: OptionProps[];
}

export default function CustomSelect({ items = [], className, ...props }: CustomSelectProps) {
  return (
    <Select className={clsx('custom-select', className)} size="large" popupClassName="custom-select-popup" {...props}>
      {items.map((op) => (
        <Option key={op.value} {...op}>
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
