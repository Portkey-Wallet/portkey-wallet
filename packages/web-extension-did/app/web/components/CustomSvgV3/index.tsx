import clsx from 'clsx';
import svgsList from '../../assets/iconV3/iconV3Svgs';
import svgAvatarsList from '../../assets/iconV3/iconV3AvatarSvgs';
import { CSSProperties } from 'react';

export type SvgTypeV3 = keyof typeof svgsList;
export type SvgAvatarTypeV3 = keyof typeof svgAvatarsList;

export function CustomSvgV3({
  type,
  className,
  fillColor,
  disabled,
  style,
  ...props
}: {
  type: SvgTypeV3;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const svgContent = svgsList[type];
  return (
    <CustomSvgBase
      type={type}
      style={style}
      svgContent={svgContent}
      className={className}
      fillColor={fillColor}
      disabled={disabled}
      {...props}
    />
  );
}

export function CustomSvgAvatarV3({
  type,
  className,
  fillColor,
  disabled,
  style,
  ...props
}: {
  type: SvgAvatarTypeV3;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const svgContent = svgAvatarsList[type];
  return (
    <CustomSvgBase
      type={type}
      svgContent={svgContent}
      className={className}
      fillColor={fillColor}
      disabled={disabled}
      {...props}
    />
  );
}

function CustomSvgBase({
  type,
  className,
  fillColor,
  svgContent,
  style,
  ...props
}: {
  type: string;
  className?: string;
  fillColor?: string;
  onClick?: () => void;
  svgContent: string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  if (fillColor) {
    svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="${fillColor}"`);
  }
  if (props.disabled) {
    svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="#626264"`);
  }
  return (
    <div
      className={clsx('custom-svg', `${type.toLocaleLowerCase()}-icon`, className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}></div>
  );
}
