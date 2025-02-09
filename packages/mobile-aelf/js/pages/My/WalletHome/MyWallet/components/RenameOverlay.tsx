import React, { useEffect, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { darkColors, defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import CommonInput from 'components/CommonInput';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import { TextM } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';

type SelectModalProps = {
  title?: string;
  nickName?: string;
  onChange?: (name: string) => void;
  avatarInfo?: {
    avatar?: string;
    localAvatar?: any;
    size: number;
  };
};

const SelectModal = ({ title = '', nickName = '', onChange, avatarInfo }: SelectModalProps) => {
  const avatarStyles = getAvatarStyles();

  const [value, setValue] = useState<string>(nickName);
  const [error, setError] = useState<boolean>(false);

  const onSave = () => {
    OverlayModal.hide();
    onChange && onChange(value);
  };
  const validText = () => {
    if (value?.length) {
      setError(!/^[a-zA-Z0-9 _]+$/.test(value));
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    validText();
  }, [value]);

  const isDisabled = error || !value.length;

  console.log('value.length', value.length > 0, value, isDisabled);

  return (
    <ModalBody modalBodyType="bottom" title={title}>
      <KeyboardSafeArea>
        <View
          style={{
            marginHorizontal: pTd(16),
          }}>
          {avatarInfo && (
            <View style={avatarStyles.container}>
              <View style={avatarStyles.avatarIconContainer}>
                <CommonAvatar
                  hasBorder={false}
                  style={avatarStyles.avatarIcon}
                  svgName={avatarInfo.avatar}
                  localImage={avatarInfo.localAvatar}
                  avatarSize={pTd(avatarInfo.size || 32)}
                  height={pTd(avatarInfo.size || 32)}
                  width={pTd(avatarInfo.size || 32)}
                  color={darkColors.textBase1Opacity04}
                />
              </View>
            </View>
          )}
          <View style={{}}>
            <CommonInput
              type="general"
              allowClear
              // keyboardType={isIOS ? 'number-pad' : 'numeric'}
              value={value}
              rightIcon={
                value ? (
                  <Touchable
                    onPress={() => {
                      setValue('');
                    }}>
                    <Svg icon="clear4" />
                  </Touchable>
                ) : undefined
              }
              onChangeText={text => {
                setValue(text);
              }}
              maxLength={16}
              errorMessage={error ? 'only a-z, A-Z, 0-9, space and "_" allowed' : undefined}
            />
          </View>
          {!error && <TextM style={{}}>{value?.length || 0}/16</TextM>}
          <CommonButton
            style={{
              marginTop: pTd(32),
              marginBottom: pTd(16),
            }}
            disabled={isDisabled}
            title={'Save'}
            type="primary"
            onPress={onSave}
          />
        </View>
      </KeyboardSafeArea>
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
  inputContainer: {},
  rnInputStyle: {},
  rightIconContainerStyle: {},
  inputStyle: {},
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

const getAvatarStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  avatarIconContainer: {
    backgroundColor: theme.colors.bgBase2,
    height: pTd(80),
    width: pTd(80),
    borderRadius: pTd(40),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
  avatarIcon: {
    backgroundColor: 'transparent',
  },
}));
