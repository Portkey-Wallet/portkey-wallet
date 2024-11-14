import React, { useCallback, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { TextL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { darkColors, defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';
import FastImage from 'components/FastImage';
import GStyles from 'assets/theme/GStyles';
import CommonTopTab from 'components/CommonTopTab';
import DiscoverTab from 'pages/Discover/components/DiscoverTopTab';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonButton from 'components/CommonButton';
import { useQrScanPermission } from 'hooks/useQrScan';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import ImageWithUploadFunc from 'components/ImageWithUploadFunc';

type SelectModalProps = {
  title?: string;
  avatar?: string;
  selectPhoto: () => boolean;
};

type AvatarListProps = {
  onChange: (idx: string | number) => void;
  itemKey?: string | number;
};

const AvatarList = (props: AvatarListProps) => {
  const { onChange, itemKey } = props;
  const avatarList = [
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
    'https://gd-hbimg.huaban.com/1bf9b061bbe51bdde88d3ad1182c20b914031e671ba2c-AuAxiq_fw1200',
  ];
  return (
    <View
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // backgroundColor: defaultColors.white,
        marginHorizontal: pTd(4),
        marginTop: pTd(24),
        // width: '100%',
      }}>
      {avatarList.map((uri, idx) => (
        <Touchable
          key={idx}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: pTd(12),
            marginRight: (idx + 1) % 5 === 0 ? 0 : pTd(13.25),
          }}
          onPress={() => {
            // setSelectKey(idx);
            onChange(idx);
          }}>
          <View
            style={{
              // display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              width: pTd(60),
              height: pTd(60),
            }}>
            <FastImage
              style={{
                width: pTd(52),
                height: pTd(52),

                borderRadius: pTd(52) / 2,
              }}
              resizeMode="cover"
              source={{ uri }}
            />
            {itemKey === idx && (
              <View
                style={{
                  position: 'absolute',
                  width: pTd(60),
                  height: pTd(60),
                  borderWidth: pTd(1),
                  borderRadius: pTd(60) / 2,
                  borderColor: defaultColors.white,
                }}
              />
            )}
          </View>
        </Touchable>
      ))}
    </View>
  );
};

const SelectModal = ({ title = '', avatar = '', selectPhoto }: SelectModalProps) => {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('avatar');

  const [selectAvatarKey, setSelectAvatarKey] = useState<string | number | undefined>();

  const [, requestQrPermission] = useQrScanPermission();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  const onSave = () => {
    console.log('onSave');
  };

  return (
    <ModalBody modalBodyType="bottom" title={title}>
      <View
        style={{
          marginHorizontal: pTd(16),
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginHorizontal: pTd(32),
          }}>
          <FastImage
            style={{
              width: pTd(80),
              height: pTd(80),
              borderRadius: pTd(80) / 2,
            }}
            resizeMode="cover"
            source={{
              uri: avatar,
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            marginTop: pTd(32),
          }}>
          <TouchableOpacity
            style={[styles.tagWrapper, selectKey === 'avatar' && { backgroundColor: darkColors.bgBase2 }]}
            key={'avatar'}
            onPress={() => {
              setSelectKey('avatar');
            }}>
            <Text
              style={[
                {
                  color: selectKey === 'avatar' ? defaultColors.white : darkColors.textBase2,
                },
              ]}>
              Select avatar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tagWrapper, selectKey === 'photo' && { backgroundColor: darkColors.bgBase2 }]}
            key={'photo'}
            onPress={() => {
              setSelectKey('photo');
            }}>
            <Text
              style={[
                {
                  color: selectKey === 'photo' ? defaultColors.white : darkColors.textBase2,
                },
              ]}>
              Upload photo
            </Text>
          </TouchableOpacity>
        </View>

        {selectKey === 'avatar' ? (
          <View>
            <AvatarList
              onChange={key => {
                setSelectAvatarKey(key);
              }}
              itemKey={selectAvatarKey}
            />
            <CommonButton
              style={{
                marginTop: pTd(48),
              }}
              disabled
              title={'Save'}
              type="primary"
              onPress={onSave}
            />
          </View>
        ) : (
          <View
            style={{
              marginVertical: pTd(32),
            }}>
            <Touchable
              style={[styles.cellWrapper]}
              onPress={async () => {
                if (!(await requestQrPermission())) return showDialog();
                navigationService.navigate('PhotoScreen');
              }}>
              <View style={styles.cellLayer}>
                <Svg icon={'camera'} size={pTd(24)} />
                <Text
                  style={{
                    marginLeft: pTd(12),
                    fontSize: pTd(16),
                  }}>
                  Take photo
                </Text>
              </View>

              <Svg icon={'chevron_right'} size={pTd(11.15)} />
            </Touchable>

            <Touchable
              style={[styles.cellWrapper, { marginTop: pTd(12) }]}
              onPress={async () => {
                const isFinished = await selectPhoto();
                if (isFinished) {
                }
              }}>
              <View style={styles.cellLayer}>
                <Svg icon={'photo'} size={pTd(24)} />
                <Text
                  style={{
                    marginLeft: pTd(12),
                    fontSize: pTd(16),
                  }}>
                  Choose from photos
                </Text>
              </View>

              <Svg icon={'chevron_right'} size={pTd(11.15)} />
            </Touchable>
          </View>
        )}
      </View>
    </ModalBody>
  );
};

export const showModal = (props: SelectModalProps) => {
  OverlayModal.show(<SelectModal {...props} />, {
    position: 'bottom',
  });
};

export default {
  showModal,
};

export const styles = StyleSheet.create({
  wrapStyle: {
    paddingHorizontal: pTd(20),
    flex: 1,
  },
  item: {
    height: 72,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
  },
  label: {
    fontSize: pTd(14),
    color: defaultColors.font5,
  },
  tagWrapper: {
    height: pTd(32),
    width: pTd(113),
    marginRight: pTd(8),
    // backgroundColor: '#1F1F21',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(8),
  },

  cellWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: pTd(48),
    backgroundColor: darkColors.bgBase2,
    borderRadius: pTd(8),
    paddingHorizontal: pTd(16),
  },

  cellLayer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
