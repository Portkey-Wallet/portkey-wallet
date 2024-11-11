import React from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { useTheme } from '@rneui/themed';
import { getTagItemStyles, getTagGroupStyles } from './style';

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
  style?: ViewStyleType;
  isRound?: boolean;
  isOutline?: boolean;
  size?: TagToggleGroupSize;
  item: ITagItem<T>;
  isSelected: boolean;
  onSelect?: (value: T) => void;
}

interface ICommonTagToggleGroupProps<T> extends Pick<ITagItemProps<T>, 'isRound' | 'isOutline' | 'size' | 'onSelect'> {
  style?: ViewStyleType;
  tagItemStyle?: ViewStyleType;
  tagList: ITagItem<T>[];
  selectedValue: T;
}

function TagItem<T extends string>({
  style,
  isRound = false,
  isOutline = false,
  isSelected,
  size = TagToggleGroupSize.MD,
  item,
  onSelect,
}: ITagItemProps<T>) {
  const styles = getTagItemStyles();
  const { theme } = useTheme();

  return (
    <Touchable
      style={[
        styles.tagItem,
        isRound && styles.tagItemRound,
        isOutline && styles.tagItemOutline,
        isSelected && styles.tagItemSelected,
        size && styles[`${size}TagItem`],
        style,
      ]}
      onPress={() => onSelect?.(item.value)}>
      {isSelected && !item.hideCheckIcon && (
        <Svg iconStyle={styles.checkIcon} icon="check" size={pTd(16)} color={theme.colors.iconBrand4} />
      )}
      {typeof item.label === 'string' ? (
        <Text style={[styles.label, isSelected && styles.selectedLabel, size && styles[`${size}Label`]]}>
          {item.label}
        </Text>
      ) : (
        item.label
      )}
    </Touchable>
  );
}

function CommonTagToggleGroup<T extends string>({
  style,
  tagItemStyle,
  isRound,
  isOutline,
  size,
  tagList,
  selectedValue,
  onSelect,
}: ICommonTagToggleGroupProps<T>) {
  const styles = getTagGroupStyles();

  return (
    <View style={[styles.tagToggleGroup, style]}>
      {tagList.map((item, index) => (
        <TagItem
          key={index}
          style={[index !== 0 && styles.tagItemMarginLeft, tagItemStyle]}
          isRound={isRound}
          isOutline={isOutline}
          isSelected={item.value === selectedValue}
          size={size}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

export default CommonTagToggleGroup;
