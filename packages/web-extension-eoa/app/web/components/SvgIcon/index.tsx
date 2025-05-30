import CustomSvg from 'components/CustomSvg';
import { CSSProperties } from 'react';
import clsx from 'clsx';
import './index.less';

export interface SvgIconProps {
  type?: string;
  name?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function SvgIcon({ type = '', name = '', size = 16, className, ...props }: SvgIconProps) {
  const renderCustomSvg = (type: any) => (
    <CustomSvg className={clsx(className)} type={type} style={{ width: size, height: size }} {...props} />
  );

  if (type) {
    return renderCustomSvg(type);
  }

  if (name) {
    return <div className="custom-name">{name[0]}</div>;
  }

  return renderCustomSvg('Bitcoin');
}
