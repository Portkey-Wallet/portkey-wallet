import { CustomSvgV3 } from 'components/CustomSvgV3';
import { ReactNode, useCallback, useState } from 'react';
import './index.less';
import clsx from 'clsx';

export type TToggleContentProps = {
  title?: string;
  children?: ReactNode;
  bodyClassName?: string;
};

export const ToggleContent = ({ bodyClassName, title = '', children }: TToggleContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <div className="toggle-content-container">
      <div className="toggle-content-header-wrap">
        <div className="toggle-content-header" onClick={toggleContent}>
          <span className="toggle-content-title">{title}</span>
          <CustomSvgV3 type={isOpen ? 'chevron_down' : 'chevron_right'} className="toggle-content-header-icon" />
        </div>
      </div>
      {isOpen && <div className={clsx('toggle-content-body')}>{children}</div>}
    </div>
  );
};
