import clsx from 'clsx';
import { SelectProps } from 'antd';
import { OptionProps } from 'antd/lib/select';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';

// import BaseDrawer from '../BaseDrawer';
// import { ModalBody } from 'components/ModalBody';

// import BaseDrawer from 'components/BaseDrawer';
import { useMemo, useState } from 'react';
import BaseModal from 'components/BaseModal';
import BaseDrawer from 'components/BaseDrawer';
import CommonCloseHeader from 'components/CommonCloseHeader';

// const { Option } = Select;
interface CustomSelectProps extends SelectProps {
  items?: OptionProps[];
  customChild?: React.ReactNode;
  title?: string;
}

// export default function CustomSelect({ items = [], className, value, onChange, ...props }: CustomSelectProps) {
export default function CustomSelect({ items = [], value, onChange, title, ...props }: CustomSelectProps) {
  const { isNotLessThan768 } = useCommonState();

  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(false);
  };
  const modalCloseHeaderProps = {
    title: title || 'Select Network',
    onClose: onClose,
  };

  const selectOption = (option: any) => {
    if (option.disabled) {
      return;
    }
    if (onChange) {
      setShow(false);
      onChange(option.value, option);
    }
  };

  const selectedItem: any = useMemo(() => {
    return items.filter((list) => list.value == value)[0];
  }, [items, value]);

  console.log('selectedItem', selectedItem);

  return (
    <>
      <div
        className={clsx('select-btn', props.disabled && 'select-btn-disabled')}
        onClick={() => {
          if (props.disabled) {
            return;
          }
          setShow(true);
        }}>
        {selectedItem?.children ? (
          <div>{selectedItem?.children}</div>
        ) : (
          <div className="placeholder">{props.placeholder || ''}</div>
        )}
        {!props.disabled && <CustomSvgV3 type="nftArrow" />}
      </div>

      {isNotLessThan768 ? (
        <BaseModal
          open={show}
          centered
          destroyOnClose
          className="select-network"
          footer={false}
          closable={false}
          maskClosable
          {...props}>
          <>
            <CommonCloseHeader className="select-network-header" {...modalCloseHeaderProps} />
            <div className="modal-content">
              {items.map((op, index) => {
                return (
                  <div
                    className={clsx('select-list', op.disabled && 'disabled')}
                    key={index}
                    onClick={() => selectOption(op)}>
                    <>{op.children}</>
                    {op.value == value && <CustomSvgV3 type="selected" />}
                  </div>
                );
              })}
            </div>
          </>
        </BaseModal>
      ) : (
        <BaseDrawer
          open={show}
          destroyOnClose
          className={`common-drawer select-network ${props.className}-drawer`}
          height="580"
          maskClosable
          placement="bottom">
          <>
            <CommonCloseHeader className="select-network-header" {...modalCloseHeaderProps} />
            <div className="modal-content">
              {items.map((op, index) => {
                return (
                  <div
                    className={clsx('select-list', op.disabled && 'disabled')}
                    key={index}
                    onClick={() => selectOption(op)}>
                    <>{op.children}</>
                    {op.value == value && <CustomSvgV3 type="selected" />}
                  </div>
                );
              })}
            </div>
          </>
        </BaseDrawer>
      )}
    </>
  );
}
