import React, { Component, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
  PanResponderInstance,
  NativeTouchEvent,
  LayoutChangeEvent,
  EmitterSubscription,
} from 'react-native';
import { ViewStyleType } from 'types/styles';
import myEvents from 'utils/deviceEvent';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

type ScrollType = 'up' | 'down' | 'left' | 'right' | 'vertical' | 'horizontal';
type PanResponderCallback = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
type TransformCallBackType = (translateX: number, translateY: number, scale: number) => void;
type OnHandleCompleted = (
  dx: number,
  dy: number,
  speedX: number,
  speedY: number,
  scaleRate: number,
) => void | undefined;
export interface TransformViewProps {
  disableScroll?: Array<ScrollType>;
  onLongPress?: (e: GestureResponderEvent) => void;
  onWillTransform?: TransformCallBackType;
  onTransforming?: TransformCallBackType;
  onDidTransform?: TransformCallBackType;
  tensionFactor?: number;
  tension?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  maxScale: number;
  minScale: number;
  inertial?: boolean;
  onWillInertialMove?: any;
  onDidInertialMove?: any;
  magnetic?: boolean;
  onWillMagnetic?: (
    translateX: number,
    translateY: number,
    scale: number,
    newX: number,
    newY: number,
    newScale: number,
  ) => boolean;
  onDidMagnetic?: TransformCallBackType;
  containerStyle?: ViewStyleType;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: ViewStyleType;
  children: ReactNode;
  enabledNestScrollView: boolean;
}

interface AnimatedValue extends Animated.Value {
  _value: number;
}
interface TransformViewState {
  translateX: AnimatedValue;
  translateY: AnimatedValue;
  scale: AnimatedValue;
}

export default class TransformView extends Component<TransformViewProps, TransformViewState> {
  static defaultProps = {
    inertial: true,
    magnetic: true,
    tension: true,
    tensionFactor: 3,
    enabledNestScrollView: false,
  };
  viewLayout: { x: number; y: number; width: number; height: number };
  prevTouches: NativeTouchEvent[];
  initContentLayout: { x: number; y: number; width: number; height: number };
  longPressTimer?: NodeJS.Timeout;
  panResponder!: PanResponderInstance;
  touchMoved?: boolean;
  lockDirection?: string;
  dxSum!: number;
  dySum!: number;
  speedX!: number;
  speedY!: number;
  touchTime?: Date;
  panResponderStatus: boolean | undefined;
  nestScrollViewLayout: any;
  listenerList: EmitterSubscription[] = [];
  constructor(props: TransformViewProps) {
    super(props);
    this.createPanResponder();
    this.prevTouches = [];
    this.viewLayout = { x: 0, y: 0, width: 0, height: 0 };
    this.initContentLayout = { x: 0, y: 0, width: 0, height: 0 };
    this.nestScrollViewLayout = { x: 0, y: 0, width: 0, height: 0 };
    this.state = {
      translateX: new Animated.Value(0) as AnimatedValue,
      translateY: new Animated.Value(0) as AnimatedValue,
      scale: new Animated.Value(1) as AnimatedValue,
    };
    this.initResponderStatus();
    this.initListeners();
  }

  componentWillUnmount() {
    this.listenerList.forEach(listener => {
      listener.remove();
    });
  }

  get contentLayout() {
    const { translateX, translateY, scale } = this.state;
    const originX = this.initContentLayout.x + this.initContentLayout.width / 2;
    const originY = this.initContentLayout.y + this.initContentLayout.height / 2;
    const scaleOriginX = originX + translateX._value;
    const scaleOriginY = originY + translateY._value;
    const scaleWidth = this.initContentLayout.width * scale._value;
    const scaleHeight = this.initContentLayout.height * scale._value;
    const scaleX = scaleOriginX - scaleWidth / 2;
    const scaleY = scaleOriginY - scaleHeight / 2;
    const contentLayout = { x: scaleX, y: scaleY, width: scaleWidth, height: scaleHeight };
    return contentLayout;
  }

  initResponderStatus() {
    this.panResponderStatus = isIOS ? !this.props.enabledNestScrollView : true;
  }
  initListeners() {
    const listener1 = myEvents.nestScrollViewScrolledTop.addListener(() => {
      this.panResponderStatus = true;
    });
    const listener2 = myEvents.nestScrollViewLayout.addListener(layout => {
      this.nestScrollViewLayout = layout;
    });
    this.listenerList = [listener1, listener2];
  }

  setupLongPressTimer(e: GestureResponderEvent) {
    const { onLongPress } = this.props;
    if (!onLongPress) return;
    this.removeLongPressTimer();
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = undefined;
      onLongPress?.(e);
    }, 500);
  }

  removeLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
  }

  createPanResponder() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { pageY } = evt.nativeEvent;
        const { dx, dy } = gestureState;
        if (isIOS) {
          const isNotNestScrollViewArea = pageY < this.viewLayout.y + this.nestScrollViewLayout.y;
          return isNotNestScrollViewArea || (!!this.panResponderStatus && dx !== 0 && dy > 5);
        }
        return !!this.panResponderStatus && dx !== 0 && dy !== 0 && (Math.abs(dx) > 5 || Math.abs(dy) > 5);
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: (e, gestureState) => this.onPanResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState) => this.onPanResponderMove(e, gestureState),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (e, gestureState) => this.onPanResponderRelease(e, gestureState),
      onPanResponderTerminate: () => true,
      onShouldBlockNativeResponder: () => true,
    });
  }
  onPanResponderGrant: PanResponderCallback = e => {
    this.setupLongPressTimer(e);
    this.touchMoved = false;
    this.lockDirection = 'none';
    this.dxSum = 0;
    this.dySum = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.touchTime = new Date();
    this.prevTouches = e.nativeEvent.touches;
    const { onWillTransform } = this.props;
    const { translateX, translateY, scale } = this.state;
    onWillTransform?.(translateX._value, translateY._value, scale._value);
  };
  getDisableScrollMap = () => {
    const disableMap =
      this.props.disableScroll?.reduce((acc: any, cur) => {
        acc[cur] = true;
        return acc;
      }, {}) || {};
    const up = disableMap.up || disableMap.vertical;
    const down = disableMap.down || disableMap.vertical;
    const left = disableMap.left || disableMap.horizontal;
    const right = disableMap.right || disableMap.horizontal;
    return { up, down, left, right };
  };
  handleNewX = (newX: number) => {
    // disableScrollLeft || disableScrollRight
    const { left, right } = this.getDisableScrollMap();
    if ((left && newX < 0) || (right && newX > 0)) newX = 0;
    return newX;
  };
  handleNewY = (newY: number) => {
    // disableScrollUp || disableScrollDown
    const { up, down } = this.getDisableScrollMap();
    if ((up && newY < 0) || (down && newY > 0)) newY = 0;
    return newY;
  };
  handleScale = (newScale?: number | null) => {
    const { minScale, maxScale } = this.props;
    if (!newScale) {
      newScale = minScale;
    } else if (newScale < minScale) {
      newScale = minScale;
    } else if (newScale > maxScale) {
      newScale = maxScale;
    }
    return newScale;
  };

  setTranslateY = (newY: number) => {
    this.state.translateY.setValue(this.handleNewY(newY));
  };
  setTranslateX = (newX: number) => {
    this.state.translateX.setValue(this.handleNewX(newX));
  };
  setScale = (newScale?: number | null) => {
    this.state.scale.setValue(this.handleScale(newScale));
  };

  getTranslateXAnimated = (newX: number, duration = 100) => {
    return Animated.timing(this.state.translateX, {
      toValue: this.handleNewX(newX),
      easing: Easing.elastic(0),
      duration,
      useNativeDriver: false,
    });
  };
  getTranslateYAnimated = (newY: number, duration = 100) => {
    return Animated.timing(this.state.translateY, {
      toValue: this.handleNewY(newY),
      easing: Easing.elastic(0),
      duration,
      useNativeDriver: false,
    });
  };
  getScaleAnimated = (newScale: number, duration = 100) => {
    return Animated.timing(this.state.scale, {
      toValue: newScale,
      easing: Easing.elastic(0),
      duration,
      useNativeDriver: false,
    });
  };

  onPanResponderMove: PanResponderCallback = e => {
    this.handleTouches(e.nativeEvent.touches, (dx, dy, speedX, speedY, scaleRate) => {
      const { tension, onTransforming, tensionFactor = 3 } = this.props;
      const { translateX, translateY, scale } = this.state;

      const { x, y, width, height } = this.contentLayout;
      if (tension) {
        if (x > this.initContentLayout.x) dx /= tensionFactor;
        else if (x + width < this.initContentLayout.x + this.initContentLayout.width) dx /= tensionFactor;
        if (y > this.initContentLayout.y) dy /= tensionFactor;
        else if (y + height < this.initContentLayout.y + this.initContentLayout.height) dy /= tensionFactor;
      }
      this.dxSum += dx;
      this.dySum += dy;
      this.speedX = speedX;
      this.speedY = speedY;
      const adx = Math.abs(this.dxSum),
        ady = Math.abs(this.dySum),
        asr = Math.abs(scaleRate - 1);
      if (!this.touchMoved && adx < 6 && ady < 6 && asr < 0.01) {
        return;
      }
      if (e.nativeEvent.touches.length === 1 && this.lockDirection === 'none') {
        if (adx > ady && height <= this.viewLayout.height) {
          this.lockDirection = 'y';
        } else if (adx < ady && width <= this.viewLayout.width) {
          this.lockDirection = 'x';
        }
      }
      let newY, newX;
      switch (this.lockDirection) {
        case 'x':
          newX = 0;
          newY = translateY._value + dy;
          break;
        case 'y':
          newX = translateX._value + dx;
          newY = 0;
          break;
        default:
          newX = translateX._value + dx;
          newY = translateY._value + dy;
          this.setScale(scale._value * scaleRate);
      }
      this.setTranslateX(newX);
      this.setTranslateY(newY);

      this.removeLongPressTimer();
      this.touchMoved = true;
      onTransforming?.(translateX._value, translateY._value, scale._value);
    });
  };

  onPanResponderRelease: PanResponderCallback = e => {
    this.initResponderStatus();
    this.removeLongPressTimer();
    this.prevTouches = [];
    this.handleRelease();
    const { onDidTransform, onPress } = this.props;
    const { translateX, translateY, scale } = this.state;
    onDidTransform?.(translateX._value, translateY._value, scale._value);
    const now = new Date();
    if (!this.touchTime) this.touchTime = now;
    if (!this.touchMoved) {
      const duration = now.getTime() - this.touchTime.getTime();
      if (duration < 500) onPress?.(e);
    }
  };

  handleTouches(touches: NativeTouchEvent[], onHandleCompleted: OnHandleCompleted) {
    const prevTouches = this.prevTouches;
    this.prevTouches = touches;

    if (touches.length === 0 || touches.length !== prevTouches.length) {
      return;
    }
    for (let i = 0; i < touches.length; ++i) {
      if (touches[i].identifier !== prevTouches[i].identifier) {
        return;
      }
    }

    //translate
    let t0, t1;
    if (touches.length === 1) {
      t0 = { x: prevTouches[0].pageX, y: prevTouches[0].pageY };
      t1 = { x: touches[0].pageX, y: touches[0].pageY };
    } else {
      t0 = {
        x: (prevTouches[0].pageX + prevTouches[1].pageX) / 2,
        y: (prevTouches[0].pageY + prevTouches[1].pageY) / 2,
      };
      t1 = { x: (touches[0].pageX + touches[1].pageX) / 2, y: (touches[0].pageY + touches[1].pageY) / 2 };
    }
    const dx = t1.x - t0.x;
    const dy = t1.y - t0.y;

    const t = touches[0].timestamp - prevTouches[0].timestamp;
    const speedX = t ? dx / t : 0;
    const speedY = t ? dy / t : 0;

    //scale
    let distance0 = 0,
      distance1 = 0;
    if (touches.length >= 2) {
      const dx0 = prevTouches[1].pageX - prevTouches[0].pageX;
      const dy0 = prevTouches[1].pageY - prevTouches[0].pageY;
      const dx1 = touches[1].pageX - touches[0].pageX;
      const dy1 = touches[1].pageY - touches[0].pageY;
      distance0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
      distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    }

    if (distance0 && distance1) {
      let scaleRate = distance1 / distance0;

      const { maxScale } = this.props;
      const { scale } = this.state;
      if (scale._value * scaleRate > maxScale) {
        scaleRate = maxScale / scale._value;
      }
      onHandleCompleted(dx, dy, speedX, speedY, scaleRate);
    } else {
      onHandleCompleted(dx, dy, speedX, speedY, 1);
    }
  }

  handleRelease() {
    const { inertial, onWillInertialMove, onDidInertialMove } = this.props;
    const { translateX, translateY } = this.state;
    let inertiaX = this.speedX * 60;
    let inertiaY = this.speedY * 60;
    if (this.lockDirection === 'x' || Math.abs(inertiaX) < 10) inertiaX = 0;
    if (this.lockDirection === 'y' || Math.abs(inertiaY) < 10) inertiaY = 0;
    if ((inertial && inertiaX) || inertiaY) {
      const newX = translateX._value + inertiaX;
      const newY = translateY._value + inertiaY;
      const animates = [];
      inertiaX && animates.push(this.getTranslateXAnimated(newX));
      inertiaY && animates.push(this.getTranslateYAnimated(newY));
      const canInertialMove =
        !onWillInertialMove || onWillInertialMove(translateX._value, translateY._value, newX, newY);
      canInertialMove &&
        Animated.parallel(animates).start(() => {
          this.setTranslateX(newX);
          this.setTranslateY(newY);
          onDidInertialMove?.(translateX._value, translateY._value, newX, newY);
          this.handleMagnetic();
        });
    } else {
      this.handleMagnetic();
    }
  }

  handleMagnetic() {
    const { magnetic, maxScale, minScale, onDidTransform, onWillMagnetic, onDidMagnetic } = this.props;
    const { translateX, translateY, scale } = this.state;
    let newX: number | null = null,
      newY: number | null = null,
      newScale: number | null | undefined = null;
    if (magnetic) {
      const { x, y, width, height } = this.contentLayout;
      if (width < this.initContentLayout.width || height < this.initContentLayout.height) {
        newX = 0;
        newY = 0;
        newScale = 1;
      } else {
        if (width < this.viewLayout.width) {
          newX = 0;
        } else if (x > 0) {
          newX = translateX._value - x;
        } else if (x + width < this.viewLayout.width) {
          newX = translateX._value + (this.viewLayout.width - (x + width));
        }
        if (height < this.viewLayout.height) {
          newY = 0;
        } else if (y > 0) {
          newY = translateY._value - y;
        } else if (y + height < this.viewLayout.height) {
          newY = translateY._value + (this.viewLayout.height - (y + height));
        }
      }
    }
    if (newScale === null) {
      if (scale._value > maxScale) newScale = maxScale;
      else if (scale._value < minScale) newScale = minScale;
    }
    const animates = [];
    newX !== null && animates.push(this.getTranslateXAnimated(newX, 200));
    newY !== null && animates.push(this.getTranslateYAnimated(newY, 200));
    newScale !== null && animates.push(this.getScaleAnimated(newScale));
    if (animates.length > 0) {
      if (newX === null) newX = translateX._value;
      if (newY === null) newY = translateY._value;
      if (newScale === null) newScale = scale._value;
      const canDoMagnetic =
        !onWillMagnetic || onWillMagnetic(translateX._value, translateY._value, scale._value, newX, newY, newScale);
      canDoMagnetic &&
        Animated.parallel(animates).start(() => {
          this.setTranslateX(newX as number);
          this.setTranslateY(newY as number);
          this.setScale(newScale);
          onDidTransform?.(newX as number, newY as number, newScale as number);
          onDidMagnetic?.(newX as number, newY as number, newScale as number);
        });
    }
  }

  onLayout(e: LayoutChangeEvent) {
    this.viewLayout = e.nativeEvent.layout;
    this.props.onLayout?.(e);
  }
  render() {
    const { style, children, containerStyle } = this.props;
    const { translateX, translateY, scale } = this.state;
    return (
      <View style={[styles.box, style]} onLayout={e => this.onLayout(e)} {...this.panResponder.panHandlers}>
        <Animated.View
          style={[
            {
              transform: [{ translateX: translateX }, { translateY: translateY }, { scale: scale }],
            },
            containerStyle,
          ]}
          onLayout={e => {
            this.initContentLayout = e.nativeEvent.layout;
          }}>
          {children}
        </Animated.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
