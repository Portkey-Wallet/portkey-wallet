import React, { useState, useCallback, useEffect, useRef, SetStateAction, Dispatch, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import ImageWithUploadFunc, { ImageShowType, ImageWithUploadFuncInstance } from 'components/ImageWithUploadFuncV2';
import { FreeMintStep } from '../FreeMintModal';
import { useGetMintItemInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import GStyles from 'assets/theme/GStyles';
import ButtonRow from 'components/ButtonRow';
import { makeStyles, useTheme } from '@rneui/themed';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import fonts from 'assets/theme/fonts';

export type EditConfig = {
  imageUri: string;
  name: string;
  description: string;
};
const MintEdit = (props: {
  itemId: string;
  editInfo?: EditConfig;
  setStep: Dispatch<SetStateAction<FreeMintStep>>;
  onEditCallback: (name: string, description: string, imageUrl: string) => void;
}) => {
  const { itemId, setStep, editInfo, onEditCallback } = props;
  const styles = getStyles();
  const { theme } = useTheme();
  const [value, setValue] = useState<EditConfig>({
    imageUri: '',
    name: '',
    description: '',
  });
  const [canNext, setNext] = useState<boolean>(false);
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  const getMintItemInfo = useGetMintItemInfo();
  const hasUploadImage = useMemo(() => !!editInfo?.imageUri, [editInfo?.imageUri]);

  useEffect(() => {
    if (editInfo) {
      setValue(prev => ({
        ...prev,
        name: editInfo.name,
        description: editInfo.description,
        imageUri: editInfo.imageUri,
      }));
      return;
    }
    if (!itemId) {
      return;
    }
    (async () => {
      const res = await getMintItemInfo(itemId);
      setValue(prev => ({ ...prev, name: res.name, description: res.description, imageUri: res.imageUrl }));
    })();
  }, [editInfo, getMintItemInfo, itemId]);
  const onChooseSuccess = useCallback((result: { uri: any }) => {
    setValue(prev => ({ ...prev, imageUri: result.uri || '' }));
  }, []);

  const onChangeNameText = useCallback((valueName: string) => {
    setValue(prev => ({ ...prev, name: valueName }));
  }, []);
  const onChangeDescriptionText = useCallback((valueDescription: string) => {
    setValue(prev => ({ ...prev, description: valueDescription }));
  }, []);
  const onNext = useCallback(async () => {
    if (!value.imageUri) return;

    // todo wfs onNext
    let s3Url = value.imageUri || '';
    if (!hasUploadImage) {
      try {
        Loading.show();
        s3Url = (await uploadRef.current?.uploadPhoto()) || '';
      } catch (error) {
        console.log(error);
        CommonToast.failError(error);
      } finally {
        Loading.hide();
      }
    }

    onEditCallback(value.name, value.description, s3Url);
    setStep && setStep(FreeMintStep.preview);
  }, [hasUploadImage, onEditCallback, setStep, value.description, value.imageUri, value.name]);

  useEffect(() => {
    if (value.imageUri && value.name) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [value.imageUri, value.name]);
  useEffect(() => {
    if (value.imageUri) {
      setShowDeleteIcon(true);
    } else {
      setShowDeleteIcon(false);
    }
  }, [setShowDeleteIcon, value.imageUri]);
  return (
    <KeyboardSafeArea containerStyle={styles.containerStyle}>
      <View style={styles.container}>
        <View style={styles.uploadContainer}>
          {/* <Touchable style={GStyles.center} onPress={() => uploadRef.current?.selectPhoto()}> */}
          {showDeleteIcon && (
            <Touchable
              style={styles.deleteIconStyle}
              activeOpacity={1}
              onPress={() => {
                uploadRef.current?.clear();
              }}>
              {/* <Image resizeMode="contain" source={deleteImage} style={{ width: pTd(28), height: pTd(28) }} /> */}
              <View style={styles.deleteMintWrapper}>
                <Svg icon="delete-mint" size={20} />
              </View>
            </Touchable>
          )}
          <View style={{ marginTop: pTd(24) }}>
            <ImageWithUploadFunc
              avatarSize={pTd(280)}
              ref={uploadRef}
              title={''}
              type={ImageShowType.NORMAL}
              imageUrl={value.imageUri}
              defaultComponent={
                <View style={styles.uploadBox}>
                  <Svg icon="upload" size={pTd(48)} />
                  <Text style={styles.uploadTextTitle}>Upload an image</Text>
                  <Text style={styles.uploadText}>Supported formats: JPG, JPEG, and PNG{'\n'}Max size: 10 MB.</Text>
                </View>
              }
              onChooseSuccess={onChooseSuccess}
            />
          </View>
          {/* </Touchable> */}
          {value.imageUri && (
            <>
              <FormItem title="Name" style={styles.formItemContainer} titleStyle={fonts.SGRegularFont}>
                <CommonInput
                  type="general"
                  value={value.name}
                  allowClear
                  placeholder={'Give your NFT a unique name'}
                  placeholderTextColor={theme.colors.textBase3}
                  maxLength={30}
                  inputContainerStyle={styles.inputWrap}
                  onChangeText={onChangeNameText}
                  containerStyle={styles.contentWrap}
                />
              </FormItem>
              <FormItem
                title="Description (Optional)"
                style={styles.formItemContainer}
                titleStyle={fonts.SGRegularFont}>
                <CommonInput
                  type="general"
                  value={value.description}
                  placeholder={'Tell people more about your NFT'}
                  maxLength={1000}
                  multiline
                  style={[GStyles.paddingTop(12), GStyles.paddingBottom(12)]}
                  inputContainerStyle={[styles.inputWrap, styles.contentDescriptionWrap]}
                  placeholderTextColor={theme.colors.textBase3}
                  inputStyle={styles.descriptionInput}
                  onChangeText={onChangeDescriptionText}
                  containerStyle={styles.contentDescriptionWrap}
                />
              </FormItem>
            </>
          )}
        </View>
        <View style={GStyles.flex1} />
        <ButtonRow
          buttons={[
            {
              disabled: !canNext,
              type: 'primary',
              title: 'Next',
              onPress: onNext,
            },
          ]}
        />
      </View>
    </KeyboardSafeArea>
  );
};

// const MintEditWrapper = () => {
//   const gStyles = useGStyles();
//   const { t } = useLanguage();
//   return (
//     <ModalBody modalBodyType="bottom" title={t('Mint NFT')} style={gStyles.overlayStyle}>
//       <MintEdit setStep={undefined} onEditCallback={undefined} />
//     </ModalBody>
//   );
// };

// export const showMintEdit = (params?: ShowAssetListParamsType) => {
//   OverlayModal.show(<MintEditWrapper {...params} />, {
//     position: 'bottom',
//     autoKeyboardInsets: false,
//     enabledNestScrollView: true,
//   });
// };

export default MintEdit;
const getStyles = makeStyles(theme => ({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginTop: pTd(4),
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingHorizontal: pTd(16),
  },
  deleteIconStyle: {
    position: 'absolute',
    right: pTd(21),
    top: pTd(2),
    zIndex: 999,
  },
  formItemContainer: {
    width: '100%',
    marginTop: pTd(32),
    paddingHorizontal: pTd(24),
  },
  btnStyle: {
    marginTop: pTd(24),
    width: '100%',
  },
  uploadContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
  },
  uploadBox: {
    overflow: 'hidden',
    width: pTd(280),
    height: pTd(280),
    padding: pTd(24),
    backgroundColor: theme.colors.bgNeutral2,
    borderRadius: pTd(16),
    borderStyle: 'dashed',
    borderWidth: pTd(1),
    borderColor: theme.colors.borderNeutral2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTextTitle: {
    extAlign: 'center',
    color: theme.colors.textNeutral5,
    fontSize: pTd(16),
    marginTop: pTd(16),
    lineHeight: pTd(23),
    ...fonts.SGRegularFont,
  },
  uploadText: {
    textAlign: 'center',
    color: theme.colors.textNeutral5,
    fontSize: pTd(12),
    marginTop: pTd(16),
    lineHeight: pTd(12),
    ...fonts.SGRegularFont,
  },
  inputWrap: {
    backgroundColor: theme.colors.bgBase1,
    borderColor: theme.colors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: pTd(52),
  },
  descriptionInput: {
    height: pTd(120),
    textAlignVertical: 'top',
  },
  contentWrap: {
    height: pTd(52),
  },
  contentDescriptionWrap: {
    height: pTd(120),
    paddingTop: pTd(12),
    paddingBottom: pTd(12),
  },
  deleteMintWrapper: {
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(24),
    backgroundColor: theme.colors.bgBrand1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
