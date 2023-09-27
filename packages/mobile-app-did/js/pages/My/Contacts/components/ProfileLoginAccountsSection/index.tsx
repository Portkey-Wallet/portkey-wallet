import { CONTACT_PRIVACY_TYPE_LABEL_MAP } from '@portkey-wallet/constants/constants-ca/contact';
import { IContactProfileLoginAccount } from '@portkey-wallet/types/types-ca/contact';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import FormItem from 'components/FormItem';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';

import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { copyText } from 'utils';
import { pTd } from 'utils/unit';

type ProfileLoginAccountsSectionPropsType = {
  list: IContactProfileLoginAccount[];
  disable?: boolean;
};

const ProfileLoginAccountsSection: React.FC<ProfileLoginAccountsSectionPropsType> = props => {
  const { list, disable } = props;

  const copyId = useCallback((ele: IContactProfileLoginAccount) => copyText(ele.identifier), []);

  const areaList = useMemo(() => {
    const _areaList: Array<{
      title: string;
      list: IContactProfileLoginAccount[];
    }> = [];
    const phoneList = list.filter(item => item.privacyType === LoginType.Phone);
    if (phoneList.length) {
      _areaList.push({
        title: CONTACT_PRIVACY_TYPE_LABEL_MAP[LoginType.Phone],
        list: phoneList,
      });
    }
    const emailList = list.filter(item => item.privacyType === LoginType.Email);
    if (emailList.length) {
      _areaList.push({
        title: CONTACT_PRIVACY_TYPE_LABEL_MAP[LoginType.Email],
        list: emailList,
      });
    }
    const googleList = list.filter(item => item.privacyType === LoginType.Google);
    if (googleList.length) {
      _areaList.push({
        title: CONTACT_PRIVACY_TYPE_LABEL_MAP[LoginType.Google],
        list: googleList,
      });
    }
    const appleList = list.filter(item => item.privacyType === LoginType.Apple);
    if (appleList.length) {
      _areaList.push({
        title: CONTACT_PRIVACY_TYPE_LABEL_MAP[LoginType.Apple],
        list: appleList,
      });
    }
    return _areaList;
  }, [list]);

  return (
    <>
      {areaList.map((area, areaIndex) => (
        <FormItem key={areaIndex} title={area.title} style={GStyles.marginTop(pTd(24))}>
          {area.list.map((ele, index) => (
            <View
              key={index}
              style={[
                disable ? BGStyles.bg18 : BGStyles.bg1,
                GStyles.flexRow,
                GStyles.itemCenter,
                GStyles.spaceBetween,
                styles.itemWrap,
                index === area.list.length - 1 && styles.itemWrapEnd,
              ]}>
              <TextM numberOfLines={1} style={styles.itemContent}>
                {ele.identifier}
              </TextM>
              <Touchable onPress={() => copyId(ele)}>
                <Svg icon="copy" size={pTd(16)} />
              </Touchable>
            </View>
          ))}
        </FormItem>
      ))}
    </>
  );
};

export default memo(ProfileLoginAccountsSection);

const styles = StyleSheet.create({
  itemWrap: {
    marginBottom: pTd(8),
    height: pTd(56),
    paddingHorizontal: pTd(16),
    borderRadius: pTd(6),
  },
  itemWrapEnd: {
    marginBottom: 0,
  },
  itemContent: {
    width: pTd(270),
    color: defaultColors.font5,
  },
});
