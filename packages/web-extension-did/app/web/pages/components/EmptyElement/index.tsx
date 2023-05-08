import { CSSProperties } from 'react';

export interface IEmptyElementProps {
  className?: string;
  style?: CSSProperties;
  height?: number;
}

export default function EmptyElement({ className, style, height = 24 }: IEmptyElementProps) {
  // eslint-disable-next-line no-inline-styles/no-inline-styles
  return <div className={className} style={{ height: height, ...style }} />;
}
