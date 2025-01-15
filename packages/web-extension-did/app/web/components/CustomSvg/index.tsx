import clsx from 'clsx';
import { CSSProperties } from 'react';
import svgsList from '../../assets/svgs';
export default function ({
  type,
  className,
  fillColor,
  ...props
}: {
  type: keyof typeof svgsList;
  className?: string;
  fillColor?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  let svgContent = svgsList[type];
  if (fillColor) {
    svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="${fillColor}"`);
  }
  return (
    <div
      className={clsx('custom-svg', `${type.toLocaleLowerCase()}-icon`, className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}></div>
  );
}

export type SvgType = keyof typeof svgsList;
