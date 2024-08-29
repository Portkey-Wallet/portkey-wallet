import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { TextM, TextL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
interface RouterParams {
  secondaryEmail?: string;
}

const SecondaryMailboxHome: React.FC = () => {
  const { secondaryEmail } = useRouterParams<RouterParams>();
  return (
    <PageContainer
      titleDom={'Details'}
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <TextM style={[FontStyles.secondaryTextColor, GStyles.marginBottom(pTd(8))]}>Backup Mailbox</TextM>
        <View style={pageStyles.labelWrap}>
          <TextL style={[FontStyles.neutralDisableText, fonts.mediumFont]}>{secondaryEmail || `Not Set up`}</TextL>
        </View>
        <TextM style={FontStyles.neutralTertiaryText}>
          {`Before authorising, signing transactions, or performing similar operations, notifications will be sent to the mailbox associated with your login account.
\n\nIf your login account cannot receive emails, they will be sent to the backup mailbox you have set up.`}
        </TextM>
      </View>
      <CommonButton
        type="primary"
        onPress={() => {
          console.log('click edit!');
          navigationService.navigate('SecondaryMailboxEdit', {
            mail: secondaryEmail,
          });
        }}>
        Edit
      </CommonButton>
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  labelWrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
});

export default SecondaryMailboxHome;
