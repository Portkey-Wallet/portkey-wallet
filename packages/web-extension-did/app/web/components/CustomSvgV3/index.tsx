import clsx from 'clsx';
import { CSSProperties } from 'react';
import svgsList from '../../assets/iconV3/iconV3Svgs';
export function CustomSvgV3({
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
      className={clsx(
        'custom-svg-24',
        `${type.toLocaleLowerCase().replaceAll(' ', '-').replaceAll('=', '-')}-icon`,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}></div>
  );
}

export type SvgTypeV3 = keyof typeof svgsList;
