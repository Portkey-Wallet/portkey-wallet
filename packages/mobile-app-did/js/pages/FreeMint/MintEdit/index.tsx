import React, { useState, useCallback, useEffect, useRef } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import { useGStyles } from 'assets/theme/useGStyles';
import Svg from 'components/Svg';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { ScrollView } from 'react-native';
import Touchable from 'components/Touchable';
import deleteImage from 'assets/image/pngs/deleteImage.png';
import ImageWithUploadFunc, { ImageShowType, ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';

// export type ShowMintEditParamsType = {};
type EditConfig = {
  imageUri: string;
  name: string;
  description: string;
};
const MintEdit = () => {
  const [value, setValue] = useState<EditConfig>({
    imageUri: '',
    name: '',
    description: '',
  });
  const [canNext, setNext] = useState<boolean>(false);
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  const { t } = useLanguage();
  const gStyles = useGStyles();
  const onChooseSuccess = useCallback((result: { uri: any }) => {
    setValue(prev => ({ ...prev, imageUri: result.uri || '' }));
  }, []);

  const onChangeNameText = useCallback((valueName: string) => {
    setValue(prev => ({ ...prev, name: valueName }));
  }, []);
  const onChangeDescriptionText = useCallback((valueDescription: string) => {
    setValue(prev => ({ ...prev, description: valueDescription }));
  }, []);
  const onNext = useCallback(() => {
    // todo wfs onNext
  }, []);
  useEffect(() => {
    if (value.imageUri && value.name && value.description) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [value.imageUri, value.name, value.description]);
  useEffect(() => {
    if (value.imageUri) {
      setShowDeleteIcon(true);
    } else {
      setShowDeleteIcon(false);
    }
  }, [setShowDeleteIcon, value.imageUri]);
  return (
    <ModalBody modalBodyType="bottom" title={t('Mint NFT')} style={gStyles.overlayStyle}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.uploadContainer}>
          {/* <Touchable style={GStyles.center} onPress={() => uploadRef.current?.selectPhoto()}> */}
          {showDeleteIcon && (
            <Touchable
              style={styles.deleteIconStyle}
              activeOpacity={1}
              onPress={() => {
                uploadRef.current?.clear();
              }}>
              <Image resizeMode="contain" source={deleteImage} style={{ width: pTd(28), height: pTd(28) }} />
            </Touchable>
          )}
          <View style={{ marginTop: pTd(8) }}>
            <ImageWithUploadFunc
              avatarSize={pTd(280)}
              ref={uploadRef}
              title={''}
              type={ImageShowType.NORMAL}
              imageUrl={''}
              defaultComponent={
                <View style={styles.uploadBox}>
                  <Svg icon="suggest-add" size={pTd(48)} />
                  <Text style={styles.uploadText}>
                    Upload a picture{'\n'}Formats supported: JPG, PNG, and GIF.{'\n'}Max size: 10 MB.
                  </Text>
                </View>
              }
              onChooseSuccess={onChooseSuccess}
            />
          </View>
          {/* </Touchable> */}
          <FormItem title="Name" style={styles.formItemContainer}>
            <CommonInput
              type="general"
              // value={'111'}
              placeholder={'Give your NFT a unique name'}
              maxLength={30}
              inputContainerStyle={styles.inputWrap}
              onChangeText={onChangeNameText}
              containerStyle={styles.contentWrap}
            />
          </FormItem>
          <FormItem title="Description (Optional)" style={styles.formItemContainer}>
            <CommonInput
              type="general"
              // value={'111'}
              placeholder={'Tell people more about your NFT'}
              maxLength={1000}
              multiline
              inputContainerStyle={[styles.inputWrap, styles.contentDescriptionWrap]}
              inputStyle={styles.descriptionInput}
              onChangeText={onChangeDescriptionText}
              containerStyle={styles.contentDescriptionWrap}
            />
          </FormItem>
          <CommonButton
            disabled={!canNext}
            type="primary"
            title={'Next'}
            containerStyle={styles.btnStyle}
            onPress={onNext}
          />
        </View>
      </ScrollView>
    </ModalBody>
  );
};

export const showMintEdit = (params?: ShowAssetListParamsType) => {
  OverlayModal.show(<MintEdit {...params} />, {
    position: 'bottom',
    autoKeyboardInsets: false,
    enabledNestScrollView: true,
  });
};

export default {
  showMintEdit,
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: pTd(50),
    backgroundColor: 'white',
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
    flexDirection: 'column',
  },
  deleteIconStyle: {
    position: 'absolute',
    right: pTd(39),
    top: 0,
    zIndex: 999,
  },
  formItemContainer: {
    width: '100%',
    marginTop: pTd(24),
  },
  btnStyle: {
    marginTop: pTd(24),
    width: '100%',
  },
  uploadContainer: {
    alignSelf: 'stretch',
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: pTd(24),
  },
  uploadBox: {
    width: pTd(280),
    height: pTd(280),
    padding: pTd(24),
    backgroundColor: defaultColors.neutralHoverBG,
    borderRadius: pTd(12),
    borderStyle: 'dashed',
    borderWidth: pTd(1),
    borderColor: defaultColors.neutralBorder,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    textAlign: 'center',
    color: defaultColors.neutralDisableText,
    fontSize: pTd(14),
    marginTop: pTd(16),
    fontWeight: '400',
    lineHeight: pTd(22),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg1,
    borderColor: defaultColors.neutralBorder,
    borderWidth: pTd(0.5),
    borderBottomWidth: pTd(0.5),
    height: pTd(52),
  },
  descriptionInput: {
    height: pTd(96),
  },
  contentWrap: {
    height: pTd(52),
  },
  contentDescriptionWrap: {
    height: pTd(120),
  },
});
