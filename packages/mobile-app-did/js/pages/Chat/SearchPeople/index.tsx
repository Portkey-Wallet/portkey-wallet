import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import InputWithCancel from 'components/InputWithCancel';
import SearchPeopleItem from '../components/SearchPeopleItem';

export default function SearchPeople() {
  const [keyword, setKeyword] = useState('');

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Search">
      <InputWithCancel
        onChangeText={v => setKeyword(v)}
        value={keyword}
        clearText={() => setKeyword('')}
        onCancel={() => navigationService.goBack()}
      />

      <SearchPeopleItem item={undefined} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
