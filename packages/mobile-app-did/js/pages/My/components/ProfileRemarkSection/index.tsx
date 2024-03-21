import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput, { CommonInputProps } from 'components/CommonInput';
import FormItem from 'components/FormItem';
import { useInputFocus } from 'hooks/useInputFocus';

import React, { memo, useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { pTd } from 'utils/unit';

const ProfileRemarkSection: React.FC<CommonInputProps> = props => {
  const iptRef = useRef<TextInput>(null);
  useInputFocus(iptRef);

  return (
    <FormItem title="Remark" style={GStyles.marginTop(pTd(24))}>
      <CommonInput ref={iptRef} type="general" inputContainerStyle={styles.inputContainerStyle} {...props} />
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
