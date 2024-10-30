import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import fonts from 'assets/theme/fonts';

export interface INetworkServiceItem {
  serviceName: string;
  multiConfirmTime: string;
  maxAmount: string | number;
}

export interface INetworkItem {
  network: string;
  name: string;
  imageUrl: string;
  serviceList: INetworkServiceItem[];
}

const SelectOptionRow = ({ item, onSelect }: { item: INetworkItem; onSelect: (item: INetworkItem) => void }) => {
  const recommendToolItem = item?.serviceList?.[0];
  const styles = getStyles();
  return (
    <Touchable style={styles.optionRow} onPress={() => onSelect?.(item)}>
      <View style={styles.optionRowLabel}>
        <Image style={styles.optionRowLeftLogo} source={{ uri: item.imageUrl }} />
        <Text style={styles.optionRowLeftNetworkName}>{item.name}</Text>
      </View>
      {!!recommendToolItem?.multiConfirmTime && (
        <Text style={styles.optionRowRightTime}>~{recommendToolItem.multiConfirmTime}</Text>
      )}
    </Touchable>
  );
};

interface ISelectNetworkProps {
  networkList: INetworkItem[];
  onSelect: (item: INetworkItem) => void;
}

const SelectNetwork: React.FC<ISelectNetworkProps> = ({ networkList, onSelect }) => {
  const styles = getStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select network</Text>
      <ScrollView>
        {networkList.map(item => (
          <SelectOptionRow key={item.network} item={item} onSelect={onSelect} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SelectNetwork;

const getStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  title: {
    marginVertical: pTd(8),
    ...fonts.BGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(20),
    lineHeight: pTd(24),
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pTd(16),
  },
  optionRowLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRowLeftLogo: {
    width: pTd(42),
    height: pTd(42),
    marginRight: pTd(8),
  },
  optionRowLeftNetworkName: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  optionRowRightTime: {
    flexShrink: 0,
    marginLeft: pTd(8),
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
}));
