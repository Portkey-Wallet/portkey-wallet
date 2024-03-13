import TransferItem from './components/TransferItem';
import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export type TransferListProps = {
  initializing?: boolean;
  rate?: { USDT: string | number };
  onPress?: (item: any) => void;
  style?: any;
} & Omit<FlatListProps<any>, 'renderItem'>;

export default function TransferList(props: TransferListProps) {
  const { onPress, style } = props;

  const renderItem = ({ item }: any) => <TransferItem key={item.address} item={item} onPress={onPress} />;

  return <FlatList renderItem={renderItem} style={style} {...props} />;
}
