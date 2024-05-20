import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Popover, PopoverProps } from 'antd';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import './styles.less';

export enum CustomSvgPlaceholderSize {
  LG = 'lg',
  MD = 'md',
}

interface IRightElementObj {
  customSvgWrapClassName?: string;
  customSvgClassName?: string;
  customSvgType: SvgType;
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
  onLeftBack?: () => void;
}

export default function CommonHeader({
  className,
  title,
  rightElementList,
  showBottomBorder,
  onLeftBack,
}: ICommonHeaderProps) {
  const renderRightElement = (element: TRightElement, index: number) => {
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
        <CustomSvg className={customSvgClassName} type={customSvgType} onClick={onClick} />
      </div>
    );
    if (popoverProps) {
      return (
        <Popover key={index} {...popoverProps}>
          {svgElement}
        </Popover>
      );
    }
    return svgElement;
  };

  return (
    <div
      className={clsx(className, 'common-header', 'flex-row-center', {
        ['common-header-bottom-border']: showBottomBorder,
      })}>
      {!!onLeftBack && (
        <CustomSvg
          className="common-header-left-icon cursor-pointer"
          type="LeftArrowWithRightSideSpacing"
          onClick={onLeftBack}
        />
      )}
      <div className="common-header-title flex-1">{title}</div>
      {!!rightElementList?.length && (
        <div className="common-header-right-wrapper flex-row-center">
          {rightElementList.map((element, index) => renderRightElement(element, index))}
        </div>
      )}
    </div>
  );
}
