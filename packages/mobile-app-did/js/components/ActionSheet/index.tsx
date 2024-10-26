import React, { ReactNode } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Text, Keyboard, ImageBackground, ImageSourcePropType, ScrollView } from 'react-native';
import { getStyles, styles as showStyles } from './style';
import { TextL, TextM, TextTitle } from 'components/CommonText';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import ButtonCol from 'components/ButtonCol';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { TextStyleType } from 'types/styles';
import Touchable from 'components/Touchable';
import { useTheme } from '@rneui/themed';

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
      <View style={showStyles.sheetBox}>
        {items.map((item, index) => {
          const { title, onPress } = item;
          return (
            <Touchable
              key={index}
              style={showStyles.itemBox}
              onPress={() => {
                OverlayModal.hide();
                onPress?.(item);
              }}>
              <Text style={showStyles.itemText}>{title}</Text>
            </Touchable>
          );
        })}
      </View>
      {cancelItem && (
        <Touchable onPress={() => OverlayModal.hide()} style={showStyles.cancelBox}>
          <Text style={showStyles.cancelText}>{cancelItem.title}</Text>
        </Touchable>
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
  messageStyle?: TextStyleType;
  titleStyle?: TextStyleType;
  bgImage?: ImageSourcePropType;
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
  isCloseShow = true,
  messageStyle,
  titleStyle,
  bgImage,
}: AlertBodyProps) {
  const styles = getStyles();
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapStyle]}>
      {/* {!!bgImage && <ImageBackground source={bgImage} style={styles.headerBackgroundBg} />}
      {isCloseShow && (
        <View
          onTouchEnd={() => {
            OverlayModal.hide();
          }}
          style={styles.closeWrap}>
          <Svg icon={'suggest-close'} size={pTd(20)} color={defaultColors.font7} />
        </View>
      )} */}
      <View style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <View style={styles.alertHeaderBlock} />
        </View>
        {isCloseShow && !bgImage && (
          <View
            onTouchEnd={() => {
              OverlayModal.hide();
            }}
            style={styles.closeWrap}>
            <Svg icon={'suggest-close'} size={pTd(20)} color={theme.colors.iconBase1} />
          </View>
        )}
        {title ? <TextTitle style={[styles.alertTitle, titleStyle]}>{title}</TextTitle> : null}
        {typeof title2 === 'string' ? <TextTitle style={styles.alertTitle2}>{title2}</TextTitle> : title2}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.scrollViewContainerStyle}>
          {typeof message === 'string' ? (
            message ? (
              <TextL style={[styles.alertMessage, messageStyle]}>{message}</TextL>
            ) : null
          ) : (
            message
          )}
          {typeof message2 === 'string' ? (
            message2 ? (
              <TextL style={[styles.alertMessage, messageStyle]}>{message2}</TextL>
            ) : null
          ) : (
            message2
          )}
          {messageList?.map((item, index) => {
            return typeof item === 'string' ? (
              item ? (
                <TextM key={index} style={[styles.alertMessage, messageStyle]}>
                  {item}
                </TextM>
              ) : null
            ) : (
              item
            );
          })}
        </ScrollView>
        {buttonGroupDirection === 'row' ? (
          <ButtonRow
            style={styles.buttonRowWrap}
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
    </View>
  );
}

const alert = (props: AlertBodyProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<AlertBody {...props} />, {
    modal: true,
    type: 'zoomOut',
    position: 'bottom',
  });
};
export default {
  show,
  alert,
};
