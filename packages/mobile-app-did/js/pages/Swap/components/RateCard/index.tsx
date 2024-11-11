import React, { useMemo, useState } from 'react';
import { useTheme } from '@rneui/themed';
import { useLanguage } from 'i18n/hooks';
import { View, Text } from 'react-native';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import CommonTagToggleGroup, { TagToggleGroupSize } from 'components/CommonTagToggleGroup';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';

interface IRateCardProps {
  style?: ViewStyleType;
  symbolIn: string;
  symbolOut: string;
  amount: string;
  rate: string;
  onChangeRate: (value: string) => void;
}

const TAG_LIST = [
  {
    value: 'Market',
    label: 'Market',
    hideCheckIcon: true,
  },
  {
    value: '1%',
    label: '1%',
    hideCheckIcon: true,
  },
  {
    value: '3%',
    label: '3%',
    hideCheckIcon: true,
  },
  {
    value: '5%',
    label: '5%',
    hideCheckIcon: true,
  },
];

const RateCard: React.FC<IRateCardProps> = ({ style, symbolIn, symbolOut, amount, rate, onChangeRate }) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [isPayRate, setIsPayRate] = useState(true);

  const title = isPayRate ? `Pay ${symbolIn} at rate` : `Receive ${symbolOut} at rate`;

  const tagList = useMemo(() => {
    return TAG_LIST.map(item => {
      const symbol = isPayRate ? '+' : '-';
      const label = item.label === 'Market' ? item.label : `${symbol}${item.label}`;
      return {
        ...item,
        label,
      };
    });
  }, [isPayRate]);

  return (
    <View style={[styles.rateCardWrap, style]}>
      <Text style={styles.title}>{t(title)}</Text>
      <View style={styles.amountWrap}>
        <Text style={styles.amountText} numberOfLines={1} ellipsizeMode="tail">
          {amount || '0'}
        </Text>
        <CommonButton
          buttonStyle={styles.switchTokenButton}
          type="outline"
          title={
            <>
              <Svg iconStyle={styles.switchTokenIcon} icon="swap-thin" size={pTd(14)} color={theme.colors.iconBase2} />
              <Text style={styles.switchTokenText}>{isPayRate ? symbolOut : symbolIn}</Text>
            </>
          }
          onPress={() => setIsPayRate(!isPayRate)}
        />
      </View>
      <CommonTagToggleGroup
        tagItemStyle={styles.tagItemStyle}
        size={TagToggleGroupSize.SM}
        isRound
        isOutline
        tagList={tagList}
        selectedValue={rate}
        onSelect={onChangeRate}
      />
    </View>
  );
};

export default RateCard;
