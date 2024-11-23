import React from 'react';
import PageContainer from 'components/PageContainer';
import { View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { makeStyles, useTheme } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { TextM, TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';

const SecondaryMailboxHome: React.FC = () => {
  const pageStyles = getStyles();
  const { theme } = useTheme();
  const { secondaryEmail, getSecondaryMail } = useIsSecondaryMailSet();

  useEffectOnce(() => {
    myEvents.updateSecondaryEmail.addListener(() => {
      getSecondaryMail();
    });
  });

  return (
    <PageContainer
      titleDom={'Details'}
      safeAreaColor={['black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <TextM style={[{ color: theme.colors.textBase1 }, GStyles.marginBottom(pTd(8))]}>Backup Mailbox</TextM>
        <View style={pageStyles.labelWrap}>
          <Svg icon="guardian-email" size={pTd(40)} iconStyle={{ marginRight: pTd(8) }} />
          <TextL style={[{ color: theme.colors.textBase1 }]}>{secondaryEmail}</TextL>
        </View>
        <View style={pageStyles.fromExchangeTipWrap}>
          <Svg icon="warning" size={pTd(22)} color={theme.colors.textBrand3} />
          <TextL style={pageStyles.fromExchangeTipText}>
            {
              "Notifications for authorizing or signing transactions will be sent to your guardian's email. If unavailable, they'll go to your backup email."
            }
          </TextL>
        </View>
      </View>
      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('SecondaryMailboxEdit', {
            mail: secondaryEmail,
          });
        }}>
        Edit
      </CommonButton>
    </PageContainer>
  );
};

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(16),
  },
  labelWrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    color: theme.colors.textBase1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  fromExchangeTipWrap: {
    backgroundColor: theme.colors.bgBase1,
    borderWidth: pTd(1),
    borderColor: theme.colors.textBase3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  fromExchangeTipText: {
    flex: 1,
    marginLeft: pTd(12),
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    fontSize: pTd(14),
  },
}));

export default SecondaryMailboxHome;
