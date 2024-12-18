import clsx from 'clsx';
// import { CSSProperties } from 'react';
import svgsList from '../../assets/iconV3/iconV3Svgs';
import svgAvatarsList from '../../assets/iconV3/iconV3AvatarSvgs';

export type SvgTypeV3 = keyof typeof svgsList;
export type SvgAvatarTypeV3 = keyof typeof svgAvatarsList;

export function CustomSvgV3({
  type,
  className,
  fillColor,
  ...props
}: {
  type: SvgTypeV3;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
}) {
  const svgContent = svgsList[type];
  return <CustomSvgBase type={type} svgContent={svgContent} className={className} fillColor={fillColor} {...props} />;
}

export function CustomSvgAvatarV3({
  type,
  className,
  fillColor,
  ...props
}: {
  type: SvgAvatarTypeV3;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
}) {
  const svgContent = svgAvatarsList[type];
  return <CustomSvgBase type={type} svgContent={svgContent} className={className} fillColor={fillColor} {...props} />;
}

function CustomSvgBase({
  type,
  className,
  fillColor,
  svgContent,
  ...props
}: {
  type: string;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
  svgContent: string;
}) {
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
