import React, { useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { darkColors, defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
// import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';
import FastImage from 'components/FastImage';
import CommonButton from 'components/CommonButton';
import CommonAvatar from 'components/CommonAvatar';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
// import ActionSheet from 'components/ActionSheet';

type SelectModalProps = {
  title?: string;
  avatar?: string;
  nickName: string;
  avatarList: string[];
  selectPhoto: (url: string) => Promise<void>;
  photoUpload: () => void;
};

type AvatarListProps = {
  onChange: (idx: number) => void;
  itemKey?: string | number;
  avatarList: string[];
};

const AvatarList = (props: AvatarListProps) => {
  const { onChange, itemKey, avatarList } = props;
  const marginWidth = (screenWidth - 40 - 60 * 5) / 4;
  console.log('marginWidth:', marginWidth, screenWidth);

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
            marginRight: (idx + 1) % 5 === 0 ? 0 : pTd(marginWidth),
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

const SelectModal = ({ title = '', avatar = '', nickName, selectPhoto, avatarList, photoUpload }: SelectModalProps) => {
  // const { t } = useLanguage();
  // const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('avatar');
  const [icon, setIcon] = useState<string>(avatar);

  const [selectAvatarKey, setSelectAvatarKey] = useState<number | undefined>();

  // const [, requestQrPermission] = useQrScanPermission();
  // const uploadRef = useRef<ImageWithUploadFuncInstance>(null);

  // const showDialog = useCallback(
  //   () =>
  //     ActionSheet.alert({
  //       title: t('Enable Camera Access'),
  //       message: t('Cannot connect to the camera. Please make sure it is turned on'),
  //       buttons: [
  //         {
  //           title: t('Close'),
  //           type: 'solid',
  //         },
  //       ],
  //     }),
  //   [t],
  // );

  // const handlePhotoUpload = async () => {
  //   try {
  //     const res = await uploadRef.current?.selectPhotoWithSource();
  //     console.log(res);
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  const onSave = () => {
    console.log('onSave');
    if (selectAvatarKey !== undefined) {
      const item = avatarList[selectAvatarKey];
      console.log('onSave:', item);
      selectPhoto(item);
      OverlayModal.hide();
    }
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
          <CommonAvatar resizeMode="cover" avatarSize={pTd(80)} imageUrl={icon || ''} title={nickName} />
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
              avatarList={avatarList}
              onChange={key => {
                setSelectAvatarKey(key);
                const item = avatarList[key];
                setIcon(item);
              }}
              itemKey={selectAvatarKey}
            />
            <CommonButton
              style={{
                marginTop: pTd(48),
              }}
              disabled={selectAvatarKey === undefined}
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
            {/* <Touchable
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
            </Touchable> */}

            <Touchable
              style={[styles.cellWrapper, { marginTop: pTd(12) }]}
              onPress={async () => {
                OverlayModal.hide();
                photoUpload();
                // const isFinished = await selectPhoto();
                // if (isFinished) {
                // }
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
