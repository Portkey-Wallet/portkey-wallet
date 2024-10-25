import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import fonts from 'assets/theme/fonts';

const SelectOptionRow = ({
  logoUri,
  networkName,
  multiConfirmTime,
  onSelect,
}: {
  logoUri: string;
  networkName: string;
  multiConfirmTime: string;
  onSelect: (value: string) => void;
}) => {
  const styles = getStyles();
  return (
    <Touchable style={styles.optionRow} onPress={() => onSelect?.(networkName)}>
      <View style={styles.optionRowLabel}>
        <Image style={styles.optionRowLeftLogo} source={{ uri: logoUri }} />
        <Text style={styles.optionRowLeftNetworkName}>{networkName}</Text>
      </View>
      {!!multiConfirmTime && <Text style={styles.optionRowRightTime}>~{multiConfirmTime}</Text>}
    </Touchable>
  );
};

interface INetworkItem {
  networkName: string;
  logoUri: string;
  multiConfirmTime: string;
}

interface ISelectNetworkProps {
  onSelect: (value: string) => void;
}

const SelectNetwork: React.FC<ISelectNetworkProps> = ({ onSelect }) => {
  const styles = getStyles();
  const networkList: INetworkItem[] = [];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select network</Text>
      <ScrollView>
        {networkList.map(({ networkName, logoUri, multiConfirmTime }, index) => (
          <SelectOptionRow
            key={index}
            logoUri={logoUri}
            networkName={networkName}
            multiConfirmTime={multiConfirmTime}
            onSelect={onSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SelectNetwork;

const getStyles = makeStyles(theme => ({
  container: {
    flex: 1,
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
