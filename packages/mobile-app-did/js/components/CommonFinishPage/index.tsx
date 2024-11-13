import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import CommonButton from 'components/CommonButton';
import { ActionType } from 'types/common';

const CommonFinishPage: React.FC = () => {
  const {
    params: { actionType, address },
  } = useRoute<RouteProp<{ params: { actionType: ActionType; address?: string; onClose?(): void } }>>();
  const styles = getStyles();

  const config = useMemo(() => {
    const result = {
      title: '',
      description: [''],
    };
    switch (actionType) {
      case ActionType.SEND:
        result.title = 'Submitted';
        result.description = [
          `Your request to send to ${formatStr2EllipsisStr(address)}`,
          'has been successfully submitted.',
        ];
        break;
      case ActionType.RECEIVE:
        result.title = 'Transaction approved';
        result.description = ['View the transaction in “Activity” tab', ' to check its status.'];
        break;
      case ActionType.LIMIT:
      case ActionType.SWAP:
        result.title = 'Transaction completed';
        result.description = ['View the transaction in “Activity” tab', ' to check its status.'];
        break;
      default:
        break;
    }
    return result;
  }, [actionType, address]);

  return (
    <PageContainer hideHeader containerStyles={styles.pageWrap} scrollViewProps={{ disabled: true }}>
      <View style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.checkIconWrap}>
            <Svg icon="check" size={pTd(44)} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{config.title}</Text>
            {config.description.map((item, index) => (
              <Text style={styles.description} key={index}>
                {item}
              </Text>
            ))}
          </View>
        </View>
        <CommonButton
          type="primary"
          onPress={() => {
            navigationService.navigate('Tab');
          }}>
          Close
        </CommonButton>
      </View>
    </PageContainer>
  );
};

export default memo(CommonFinishPage);

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    flex: 1,
  },
  checkIconWrap: {
    width: pTd(64),
    height: pTd(64),
    padding: pTd(10),
    marginTop: pTd(80),
    marginRight: 'auto',
    marginBottom: pTd(16),
    marginLeft: 'auto',
    borderRadius: pTd(200),
    backgroundColor: theme.colors.bgSuccess2,
  },
  textWrap: {
    paddingTop: pTd(24),
    paddingBottom: pTd(24),
  },
  title: {
    marginBottom: pTd(8),
    ...fonts.BGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(20),
    lineHeight: pTd(24),
    textAlign: 'center',
  },
  description: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    lineHeight: pTd(22),
    textAlign: 'center',
  },
}));
