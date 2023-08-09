import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import FormItem from 'components/FormItem';

import { pTd } from 'utils/unit';
import CommonInput from 'components/CommonInput';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

const Profile = () => {
  const { t } = useLanguage();

  const [keyword, setKeyword] = useState<string>('11');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onKeywordChange = useCallback((v: string) => {
    setKeyword(v.trim());
  }, []);

  return (
    <PageContainer
      titleDom={'detail'}
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <ScrollView>
        <CommonAvatar title="s" />
        <Image source={{ uri: '' }} style={{}} />
        <FormItem title={'Wallet Name'}>
          <TextM style={BGStyles.bg1}>Wallet Name</TextM>
        </FormItem>
        <FormItem title={'Remark'}>
          <CommonInput
            type="general"
            spellCheck={false}
            autoCorrect={false}
            value={keyword}
            theme={'white-bg'}
            placeholder={t('Enter Symbol')}
            onChangeText={onKeywordChange}
            errorMessage={errorMessage}
          />
        </FormItem>
        <FormItem title={'Portkey ID'}>
          <CommonInput
            type="general"
            spellCheck={false}
            autoCorrect={false}
            value={keyword}
            theme={'white-bg'}
            placeholder={t('Enter Symbol')}
            onChangeText={onKeywordChange}
            errorMessage={errorMessage}
          />
        </FormItem>
        <FormItem title={'DID'}>
          <CommonInput
            type="general"
            spellCheck={false}
            autoCorrect={false}
            value={keyword}
            theme={'white-bg'}
            placeholder={t('Enter Symbol')}
            onChangeText={onKeywordChange}
            errorMessage={errorMessage}
          />
        </FormItem>
      </ScrollView>
      <View style={styles.buttonGroupWrap}>
        <CommonButton title="Chat" type="primary" onPress={() => navigationService.navigate('ChatDetails')} />
        <CommonButton disabledTitleStyle={FontStyles.font12} titleStyle={FontStyles.font12} type="clear" title="Edit" />
      </View>
    </PageContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(20),
  },
  svgWrap: {
    padding: pTd(16),
  },
  buttonGroupWrap: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    paddingHorizontal: pTd(20),
  },
});
