import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from '@rneui/themed';
import Touchable from 'components/Touchable';
import ExchangeIcons from 'components/ExchangeIcons';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

const Card = ({
  title,
  content,
  isSelected,
  showCardMargin = false,
  onPress,
}: {
  title: string;
  content?: React.ReactNode;
  isSelected: boolean;
  showCardMargin?: boolean;
  onPress: () => void;
}) => {
  const styles = getStyles();
  return (
    <Touchable onPress={onPress}>
      <View style={[styles.card, isSelected && styles.selectedCard, showCardMargin && styles.cardMargin]}>
        <View style={styles.header}>
          <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>{title}</Text>
          {isSelected && <Svg iconStyle={styles.checkIcon} icon="check-circle" size={pTd(24)} />}
        </View>
        {!!content && <View style={styles.content}>{content}</View>}
      </View>
    </Touchable>
  );
};

const SelectExchangeCard: React.FC<{
  isSendToExchange: boolean;
  setIsSendToExchange: React.Dispatch<React.SetStateAction<boolean>>;
}> = props => {
  const { isSendToExchange, setIsSendToExchange } = props;

  return (
    <View>
      <Card
        title="Yes, send to an exchange"
        content={<ExchangeIcons />}
        isSelected={isSendToExchange}
        onPress={() => setIsSendToExchange(true)}
      />
      <Card
        title="No, it’s a non-exchange address"
        isSelected={!isSendToExchange}
        showCardMargin
        onPress={() => setIsSendToExchange(false)}
      />
    </View>
  );
};

export default SelectExchangeCard;

const getStyles = makeStyles(theme => ({
  card: {
    padding: pTd(16),
    borderRadius: pTd(16),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  cardMargin: {
    marginTop: pTd(16),
  },
  selectedCard: {
    backgroundColor: theme.colors.bgBase2,
    borderColor: theme.colors.borderBrand1,
  },
  cardText: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  selectedCardText: {
    color: theme.colors.textBase1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: pTd(12),
  },
  content: {
    marginTop: pTd(10),
  },
}));
