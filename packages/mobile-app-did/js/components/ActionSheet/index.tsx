import React, { ReactNode } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { styles } from './style/style';
import { TextL, TextM, TextTitle } from 'components/CommonText';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import ButtonCol from 'components/ButtonCol';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';

const show = (
  items: {
    title: string;
    onPress?: (v: any) => void;
  }[],
  cancelItem?: {
    title: string;
  },
) => {
  Keyboard.dismiss();
  OverlayModal.show(
    <>
      <View style={styles.sheetBox}>
        {items.map((item, index) => {
          const { title, onPress } = item;
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemBox}
              onPress={() => {
                OverlayModal.hide();
                onPress?.(item);
              }}>
              <Text style={styles.itemText}>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {cancelItem && (
        <TouchableOpacity onPress={() => OverlayModal.hide()} style={styles.cancelBox}>
          <Text style={styles.cancelText}>{cancelItem.title}</Text>
        </TouchableOpacity>
      )}
    </>,
    {
      position: 'bottom',
    },
  );
};

type AlertBodyProps = {
  title?: string;
  title2?: ReactNode;
  message?: ReactNode;
  message2?: ReactNode;
  buttons?: ButtonRowProps['buttons'];
  autoClose?: boolean;
  messageList?: ReactNode[];
  buttonGroupDirection?: 'row' | 'column';
  isCloseShow?: boolean;
};

function AlertBody({
  title,
  message,
  buttons,
  message2,
  title2,
  autoClose = true,
  messageList,
  buttonGroupDirection = 'row',
  isCloseShow = false,
}: AlertBodyProps) {
  return (
    <View style={[styles.alertBox, isCloseShow && styles.alertBoxWithClose]}>
      {isCloseShow && (
        <View
          onTouchEnd={() => {
            OverlayModal.hide();
          }}
          style={styles.closeWrap}>
          <Svg icon={'close'} size={pTd(12.5)} color={defaultColors.font7} />
        </View>
      )}
      {title ? <TextTitle style={styles.alertTitle}>{title}</TextTitle> : null}
      {typeof title2 === 'string' ? <TextL style={styles.alertTitle2}>{title2}</TextL> : title2}
      {typeof message === 'string' ? <TextM style={styles.alertMessage}>{message}</TextM> : message}
      {typeof message2 === 'string' ? <TextM style={styles.alertMessage}>{message2}</TextM> : message2}
      {messageList?.map((item, index) => {
        return typeof item === 'string' ? (
          <TextM key={index} style={styles.alertMessage}>
            {item}
          </TextM>
        ) : (
          item
        );
      })}

      {buttonGroupDirection === 'row' ? (
        <ButtonRow
          buttons={buttons?.map(i => ({
            ...i,
            onPress: () => {
              if (autoClose) OverlayModal.hide();
              i.onPress?.();
            },
          }))}
        />
      ) : (
        <ButtonCol
          buttons={buttons?.map(i => ({
            ...i,
            onPress: () => {
              if (autoClose) OverlayModal.hide();
              i.onPress?.();
            },
          }))}
        />
      )}
    </View>
  );
}

const alert = (props: AlertBodyProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<AlertBody {...props} />, {
    modal: true,
    type: 'zoomOut',
    position: 'center',
  });
};
export default {
  show,
  alert,
};
