import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { TextM, TextXL } from 'components/CommonText';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { makeStyles, useThemeMode } from '@rneui/themed';

const SendFinishPage: React.FC = () => {
  const {
    params: { address },
  } = useRoute<RouteProp<{ params: { address: string } }>>();
  const styles = getStyles();
  const { setMode } = useThemeMode();

  return (
    <PageContainer hideHeader>
      <View style={styles.pageWrap}>
        <Svg icon="Contract" />
        <TextXL
          onPress={() => {
            setMode('light');
          }}>
          Submitted
        </TextXL>
        <TextM>{`Your request to send to ${formatStr2EllipsisStr(address)} has been successfully submitted.`}</TextM>
      </View>
    </PageContainer>
  );
};

export default memo(SendFinishPage);

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
  },
}));
