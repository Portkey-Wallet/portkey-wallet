import React from 'react';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useAppSelector } from 'store/hooks';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useChangeNetwork } from 'hooks/network';
import { useRoute } from '@react-navigation/native';

const SwitchNetworks: React.FC = () => {
  const { t } = useLanguage();
  const { currentNetwork } = useAppSelector(state => state.wallet);
  const NetworkList = useNetworkList();
  const route = useRoute();
  const changeNetwork = useChangeNetwork(route);

  return (
    <PageContainer
      titleDom={t('Switch Networks')}
      safeAreaColor={['white', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {NetworkList.map(item => (
        <Touchable
          key={item.networkType}
          disabled={item.networkType === currentNetwork || !item.isActive}
          onPress={() => changeNetwork(item)}>
          <View style={styles.networkItemWrap}>
            <Svg icon={item.networkType === 'MAINNET' ? 'mainnet' : 'testnet'} size={pTd(28)} />
            <TextM style={[GStyles.flex1, GStyles.marginLeft(12), !item.isActive && FontStyles.font7]}>
              {item.name}
            </TextM>
            {item.isActive && (
              <Svg
                icon={item.networkType !== currentNetwork ? 'unselected' : 'selected'}
                size={pTd(20)}
                color={item.networkType === currentNetwork ? defaultColors.primaryColor : undefined}
              />
            )}
          </View>
        </Touchable>
      ))}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg6,
    ...GStyles.paddingArg(24, 20, 0),
  },
  networkItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(54),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
  },
});

export default SwitchNetworks;
