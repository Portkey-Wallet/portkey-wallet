import React, { ReactNode } from 'react';
import { Dialog } from '@rneui/base';
import { View } from 'react-native';
import { style } from './style';

type AElfDialogProps = {
  isShow: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onBackdropPress?: () => void;
  children?: ReactNode;
};

const AElfDialog: React.FC<AElfDialogProps> = props => {
  const {
    isShow,
    title = 'Title',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    onBackdropPress = onCancel,
    children = null,
  } = props;

  return (
    <Dialog
      overlayStyle={style.dialogWrap}
      isVisible={isShow}
      onBackdropPress={() => {
        onBackdropPress?.();
      }}>
      <Dialog.Title title={title} titleStyle={style.titleStyle} />
      {children}
      <View style={style.buttonWrap}>
        <Dialog.Button
          containerStyle={{ ...style.buttonGeneral, ...style.cancelButton }}
          titleStyle={style.cancelButtonTitle}
          title={cancelText}
          onPress={() => {
            onCancel?.();
          }}
        />
        <Dialog.Button
          containerStyle={{ ...style.buttonGeneral, ...style.confirmButton }}
          title={confirmText}
          titleStyle={style.confirmButtonTitle}
          onPress={() => {
            onConfirm?.();
          }}
        />
      </View>
    </Dialog>
  );
};

export default AElfDialog;
