import clsx from 'clsx';
import { CSSProperties } from 'react';
import './index.less';

export interface IPromptEmptyElementProps {
  className?: string;
  style?: CSSProperties;
  height?: number;
}

export default function PromptEmptyElement({ className, style, height = 24 }: IPromptEmptyElementProps) {
  return <div className={clsx(['prompt-empty-element', className])} style={{ paddingTop: height, ...style }} />;
}
