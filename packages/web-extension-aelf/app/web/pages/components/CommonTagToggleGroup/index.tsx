import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import React, { useCallback } from 'react';
import './index.less';

export enum TagToggleGroupSize {
  MD = 'md',
  SM = 'sm',
}

interface ITagItem<T> {
  label: React.ReactNode;
  value: T;
  hideCheckIcon?: boolean;
}

interface ITagItemProps<T> {
  className?: string;
  isRound?: boolean;
  isOutline?: boolean;
  size?: TagToggleGroupSize;
  item: ITagItem<T>;
  isSelected: boolean;
  onSelect?: (value: T, item: ITagItem<T>) => void;
}

interface ICommonTagToggleGroupProps<T> extends Pick<ITagItemProps<T>, 'isRound' | 'isOutline' | 'size' | 'onSelect'> {
  className?: string;
  tagItemClassName?: string;
  tagList: ITagItem<T>[];
  selectedValue?: T;
}

function TagItem<T extends string>({
  className,
  // isRound = false,
  // isOutline = false,
  isSelected,
  // size = TagToggleGroupSize.MD,
  item,
  onSelect,
}: ITagItemProps<T>) {
  const onClick = useCallback(() => {
    onSelect?.(item.value, item);
  }, [item, onSelect]);

  return (
    <div className={clsx('common-tag-item', isSelected && 'common-tag-item-selected', className)} onClick={onClick}>
      {isSelected && !item.hideCheckIcon && (
        <CustomSvgV3
          className="common-tag-item-check-icon"
          type="check"
          // color={theme.colors.iconBrand4}
        />
      )}
      {typeof item.label === 'string' ? <div className="common-tag-item-label">{item.label}</div> : item.label}
    </div>
  );
}

export const CommonTagToggleGroup = <T extends string>({
  className,
  tagItemClassName,
  isRound,
  isOutline,
  size,
  tagList,
  selectedValue,
  onSelect,
}: ICommonTagToggleGroupProps<T>) => {
  return (
    <div className={clsx('common-tag-toggle-group', className)}>
      {tagList.map((item, index) => (
        <TagItem
          key={index}
          className={tagItemClassName}
          isRound={isRound}
          isOutline={isOutline}
          isSelected={item.value === selectedValue}
          size={size}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
