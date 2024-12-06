import React from 'react';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { View, Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useAppSelector } from 'store/hooks';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useChangeNetwork } from 'hooks/network';
import { useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';

const SwitchNetworks: React.FC = () => {
  const { t } = useLanguage();
  const { currentNetwork } = useAppSelector(state => state.wallet);
  const NetworkList = useNetworkList();
  const route = useRoute();
  const changeNetwork = useChangeNetwork(route);
  const styles = getStyles();
  const theme = useTheme();

  return (
    <PageContainer
      titleDom={t('Switch Network')}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {NetworkList.map(item => (
        <Touchable
          key={item.networkType}
          disabled={item.networkType === currentNetwork}
          onPress={() => changeNetwork(item)}>
          <View style={styles.networkItemWrap}>
            <View style={styles.networkItem}>
              <Svg icon={item.networkType === 'MAINNET' ? 'mainnet' : 'testnet'} size={pTd(42)} />
              <TextM style={styles.networkText}>{item.name}</TextM>
              {item.networkType === currentNetwork && (
                <View style={styles.curLabel}>
                  <Text style={{ color: theme.theme.colors.textSuccess5 }}>Current</Text>
                </View>
              )}
            </View>
            {item.networkType !== currentNetwork && (
              <Svg icon="right-arrow" size={pTd(20)} color={defaultColors.icon1} />
            )}
          </View>
        </Touchable>
      ))}
    </PageContainer>
  );
};

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(16, 0, 0, 0),
  },
  networkItemWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(74),
    paddingHorizontal: pTd(16),
    backgroundColor: theme.colors.bg6,
  },
  networkItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkText: {
    fontSize: pTd(16),
    marginLeft: pTd(8),
  },
  curLabel: {
    fontSize: pTd(12),
    borderRadius: pTd(4),
    marginLeft: pTd(4),
    backgroundColor: theme.colors.bgSuccess2,
    ...GStyles.paddingArg(4, 6),
  },
}));

export default SwitchNetworks;
