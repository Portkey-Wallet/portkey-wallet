import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput, { CommonInputProps } from 'components/CommonInput';
import FormItem from 'components/FormItem';

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const ProfileRemarkSection: React.FC<CommonInputProps> = props => {
  return (
    <FormItem title="Remark" style={GStyles.marginTop(pTd(24))}>
      <CommonInput type="general" inputContainerStyle={styles.inputContainerStyle} {...props} />
    </FormItem>
  );
};

export default memo(ProfileRemarkSection);

const styles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: defaultColors.bg1,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
});
