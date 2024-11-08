import React from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { useTheme } from '@rneui/themed';
import { getTagItemStyles, getTagGroupStyles } from './style';

interface ITagItem<T> {
  label: React.ReactNode;
  value: T;
  hideCheckIcon?: boolean;
}

interface ITagItemProps<T> {
  style?: ViewStyleType;
  item: ITagItem<T>;
  isSelected: boolean;
  onSelect?: (value: T) => void;
}

interface ICommonTagToggleGroupProps<T> {
  style?: ViewStyleType;
  tagList: ITagItem<T>[];
  selectedValue: T;
  onSelect?: (value: T) => void;
}

function TagItem<T extends string>({ style, item, isSelected, onSelect }: ITagItemProps<T>) {
  const styles = getTagItemStyles();
  const { theme } = useTheme();

  return (
    <Touchable
      style={[styles.tagItem, isSelected && styles.selectedTagItem, style]}
      onPress={() => onSelect?.(item.value)}>
      {isSelected && !item.hideCheckIcon && (
        <Svg iconStyle={styles.checkIcon} icon="check" size={pTd(16)} color={theme.colors.iconBrand4} />
      )}
      {typeof item.label === 'string' ? (
        <Text style={[styles.label, isSelected && styles.selectedLabel]}>{item.label}</Text>
      ) : (
        item.label
      )}
    </Touchable>
  );
}

function CommonTagToggleGroup<T extends string>({
  style,
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
          style={[index !== 0 && styles.tagItemMarginLeft]}
          item={item}
          isSelected={item.value === selectedValue}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

export default CommonTagToggleGroup;
