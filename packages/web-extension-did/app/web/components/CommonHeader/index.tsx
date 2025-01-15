import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Popover, PopoverProps } from 'antd';
import './styles.less';
import { CustomSvgV3, SvgTypeV3 } from '../CustomSvgV3';

export enum CustomSvgPlaceholderSize {
  LG = 'lg',
  MD = 'md',
}

interface IRightElementObj {
  customSvgWrapClassName?: string;
  customSvgClassName?: string;
  customSvgType: SvgTypeV3;
  customSvgPlaceholderSize?: CustomSvgPlaceholderSize;
  popoverProps?: PopoverProps;
  onClick?: () => void;
}

type TRightElement = ReactNode | IRightElementObj;

export interface ICommonHeaderProps {
  className?: string;
  title?: ReactNode;
  rightElementList?: TRightElement[];
  showBottomBorder?: boolean;
  onLeftBack?: (() => void) | false;
  onLeftBackShowClose?: boolean;
}

export default function CommonHeader({
  className,
  title,
  rightElementList,
  showBottomBorder,
  onLeftBack = false,
  onLeftBackShowClose = false,
}: ICommonHeaderProps) {
  const renderRightElement = (element: TRightElement, index: number) => {
    if (!element) return;
    if (React.isValidElement(element)) {
      return <React.Fragment key={index}>{element}</React.Fragment>;
    }
    const {
      customSvgWrapClassName,
      customSvgClassName,
      customSvgType,
      customSvgPlaceholderSize = CustomSvgPlaceholderSize.LG,
      popoverProps,
      onClick,
    } = element as IRightElementObj;
    const svgElement = (
      <div
        className={clsx(
          'common-header-right-icon-wrap',
          'flex-center',
          'cursor-pointer',
          `common-header-right-icon-wrap-${customSvgPlaceholderSize}`,
          customSvgWrapClassName,
        )}>
        <CustomSvgV3 className={customSvgClassName} type={customSvgType} onClick={onClick} />
      </div>
    );
    if (popoverProps) {
      return (
        <Popover key={index} {...popoverProps}>
          {svgElement}
        </Popover>
      );
    }
    return <React.Fragment key={index}>{svgElement}</React.Fragment>;
  };

  return (
    <div
      className={clsx(className, 'common-header', 'flex-row-center', {
        ['common-header-bottom-border']: showBottomBorder,
      })}>
      {onLeftBack ? (
        onLeftBackShowClose ? (
          <CustomSvgV3 className="common-header-left-icon cursor-pointer" type="close" onClick={onLeftBack} />
        ) : (
          <CustomSvgV3 className="common-header-left-icon cursor-pointer" type="arrow-left" onClick={onLeftBack} />
        )
      ) : (
        ''
      )}
      <div className={clsx('common-header-title', 'flex-1', { ['text-ellipsis']: typeof title === 'string' })}>
        {title}
      </div>
      {!!rightElementList?.length && (
        <div className="common-header-right-wrapper flex-row-center">
          {rightElementList.map((element, index) => renderRightElement(element, index))}
        </div>
      )}
    </div>
  );
}
