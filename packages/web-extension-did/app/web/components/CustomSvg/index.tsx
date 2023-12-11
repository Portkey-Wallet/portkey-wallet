import clsx from 'clsx';
import { CSSProperties } from 'react';
import svgsList from '../../assets/svgs';
export default function ({
  type,
  className,
  ...props
}: {
  type: keyof typeof svgsList;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx('custom-svg', `${type.toLocaleLowerCase()}-icon`, className)}
      dangerouslySetInnerHTML={{ __html: svgsList[type] }}
      {...props}></div>
  );
}

export type SvgType = keyof typeof svgsList;
