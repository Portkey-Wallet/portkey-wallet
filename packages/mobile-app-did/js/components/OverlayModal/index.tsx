import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { bottomBarHeight, screenHeight, screenWidth, statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import { darkColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import TransformView from 'components/TransformView';
import { ViewStyleType } from 'types/styles';
import { sleep } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';

export type OverlayInterface = {
  close?: (animated?: boolean) => void;
};

let elements: OverlayInterface[] = [];
const DefaultOverlayProps = {
  modal: false,
  type: 'custom',
  overlayOpacity: 0.8,
  customBounds: {
    x: 0,
    y: screenHeight,
    width: screenWidth,
    height: 0,
  },
};

export type CustomBounds = { x: number; y: number; width: number; height: number };
export type OverlayModalProps = {
  position?: 'bottom' | 'center';
  modal?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: 'custom' | 'zoomOut';
  autoKeyboardInsets?: boolean;
  animated?: boolean;
  enabledNestScrollView?: boolean;
  onCloseRequest?: () => void;
  customBounds?: CustomBounds;
  overlayOpacity?: number;
  // Called after the floating layer is hidden.
  onDisappearCompleted?: () => void;
};

export function OverlayTransformView({
  containerStyle,
  children,
  enabledNestScrollView,
  onCloseRequest,
}: {
  containerStyle?: ViewStyleType;
  children: ReactNode;
  enabledNestScrollView?: boolean;
  onCloseRequest?: OverlayModalProps['onCloseRequest'];
}) {
  return (
    <TransformView
      maxScale={1}
      minScale={1}
      tension={false}
      style={styles.flex0}
      containerStyle={containerStyle}
      disableScroll={['up', 'horizontal']}
      enabledNestScrollView={enabledNestScrollView}
      onDidTransform={(_: number, translateY: number) => {
        if (translateY > 50) {
          onCloseRequest?.();
          OverlayModal.hide();
        }
      }}>
      {children}
    </TransformView>
  );
}

export default class OverlayModal extends React.Component {
  static show(component: ReactNode, overlayProps: OverlayModalProps = {}): number {
    const {
      position,
      style: propsStyle,
      containerStyle: propsContainerStyle,
      enabledNestScrollView,
      ...props
    } = overlayProps;
    const style: StyleProp<ViewStyle> = [];
    const containerStyle: StyleProp<ViewStyle> = [];
    if (position) {
      style.push(stylesMap[position].style);
      containerStyle.push(stylesMap[position].containerStyle);
    } else {
      style.push(styles.bgStyle);
      containerStyle.push(styles.containerStyle);
    }
    propsStyle && style.push(propsStyle);
    propsContainerStyle && containerStyle.push(propsContainerStyle);
    let overlayView, currentRef: OverlayInterface | undefined;
    const onCloseRequest = props.onCloseRequest;
    if (onCloseRequest) {
      props.onCloseRequest = () => {
        currentRef ? currentRef.close?.() : OverlayModal.hide();
        onCloseRequest();
      };
    }
    if (position === 'bottom') {
      overlayView = (
        <Overlay.PopView
          {...DefaultOverlayProps}
          containerStyle={[GStyles.flex1, style]}
          ref={(v: OverlayInterface) => {
            currentRef = v;
            elements.push(v);
          }}
          {...props}>
          <OverlayTransformView
            onCloseRequest={props.onCloseRequest}
            containerStyle={containerStyle}
            enabledNestScrollView={!!enabledNestScrollView}>
            {component}
          </OverlayTransformView>
        </Overlay.PopView>
      );
    } else {
      overlayView = (
        <Overlay.PopView
          {...DefaultOverlayProps}
          style={style}
          containerStyle={containerStyle}
          ref={(v: OverlayInterface) => elements.push(v)}
          {...props}>
          {component}
        </Overlay.PopView>
      );
    }
    return Overlay.show(overlayView) as number;
  }

  static showOnce(component: ReactNode, overlayProps: OverlayModalProps = {}) {
    OverlayModal.hide();
    OverlayModal.show(component, overlayProps);
  }

  static hide(animated?: boolean) {
    elements = elements.filter(item => item); // Discard invalid data
    const topItem = elements.pop();
    topItem?.close?.(animated);
  }
  static hideSync() {
    OverlayModal.hide();
    return sleep(150);
  }

  static hideKey(key: number) {
    Overlay.hide(key);
  }

  static destroy() {
    elements.forEach(item => {
      item?.close?.();
    });
    elements = [];
  }

  componentWillUnmount() {
    OverlayModal.destroy();
  }
}
const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: darkColors.bgBase1,
  },
  containerStyle: {
    flex: 1,
  },
  // center
  centerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainerStyle: {
    marginBottom: statusBarHeight,
  },
  // bottom
  bottomStyle: { flexDirection: 'column-reverse' },
  bottomContainerStyle: {
    paddingBottom: bottomBarHeight,
    backgroundColor: darkColors.bgBase1,
    ...GStyles.radiusArg(0, 0, 0, 0),
    overflow: 'hidden',
    borderTopWidth: pTd(1),
    borderTopColor: darkColors.bgBase3,
  },
  transformViewContainer: {
    justifyContent: 'flex-start',
  },
  flex0: {
    flex: 0,
  },
});

const stylesMap = {
  bottom: {
    style: styles.bottomStyle,
    containerStyle: styles.bottomContainerStyle,
  },
  center: {
    style: styles.centerStyle,
    containerStyle: styles.centerContainerStyle,
  },
};
