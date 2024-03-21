import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  PanResponder,
  TextStyle,
  GestureResponderEvent,
  View,
  PanResponderCallbacks,
  Animated,
} from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { TextStyleType, ViewStyleType } from 'types/styles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
export interface IndexBarProps {
  data: string[];
  style?: ViewStyleType;
  indexBarItemStyle?: ViewStyleType;
  indexTextStyle?: TextStyle;
  onPress?: (index: number) => void;
  showPopover?: boolean;
  disableIndexSelect?: boolean;
}
interface PageLocationType {
  height: number;
  pageX: number;
  pageY: number;
  indexHeight: number;
}
interface IndexInfoType extends PageLocationType {
  currentIndex: number;
}
type PopoverInfo = {
  text: string | number;
  top: number;
  indexHeight: number;
};

interface PopoverInterface {
  setPopoverInfo: (info?: PopoverInfo) => void;
  setShow: (show?: boolean) => void;
}

export const Popover = forwardRef(function Popover(_, _ref) {
  const [show, setShow] = useState<boolean>();
  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>();
  const marginTop = useRef(new Animated.Value(0)).current;
  const onSetPopoverInfo = useCallback(
    (info: PopoverInfo) => {
      if (!info) return;
      marginTop.setValue(info.top - (styles.popover.height - info.indexHeight) / 2);
      setPopoverInfo(info);
      // Animated ?
      // Animated.timing(marginTop, {
      //   useNativeDriver: false,
      //   toValue: info.top - info.indexHeight / 2,
      //   duration: 0,
      // }).start(({ finished }) => {
      //   finished && setPopoverInfo(info);
      // });
    },
    [marginTop],
  );
  useImperativeHandle(_ref, () => ({ setPopoverInfo: onSetPopoverInfo, setShow }), [onSetPopoverInfo]);

  if (!popoverInfo || !popoverInfo.text || !show) return null;
  return (
    <Animated.View style={[styles.popover, { marginTop }]}>
      <TextL style={[styles.popoverItem]}>{popoverInfo.text}</TextL>
    </Animated.View>
  );
});

const IndexBarItem = memo(
  function IndexBarItem({
    style,
    indexTextStyle,
    indexWrapSelectStyle,
    indexTextSelectStyle,
    indexWrapStyle,
    text,
    isSelected = false,
  }: {
    style?: ViewStyleType;
    indexTextStyle?: TextStyleType;
    indexWrapSelectStyle?: ViewStyleType;
    indexTextSelectStyle?: TextStyleType;
    indexWrapStyle?: ViewStyleType;
    text: string;
    isSelected?: boolean;
  }) {
    return (
      <View style={[style]}>
        <View style={[indexWrapStyle, isSelected && indexWrapSelectStyle]}>
          <TextS style={[styles.indexTextStyle, indexTextStyle, isSelected && indexTextSelectStyle]}>{text}</TextS>
        </View>
      </View>
    );
  },
  (prevPros, nextProps) => prevPros.isSelected === nextProps.isSelected && prevPros.text === nextProps.text,
);

export type IndexBarInterface = {
  setSelectIndex: (selectIndex: number) => void;
};

const IndexBar = forwardRef(function IndexBar(
  { style, data, indexBarItemStyle, indexTextStyle, onPress, showPopover, disableIndexSelect = false }: IndexBarProps,
  forwardedRef,
) {
  const indexInfoRef = useRef<IndexInfoType>();
  const indexRef = useRef<View>(null);
  const popoverRef = useRef<PopoverInterface>();
  const dataLength = useRef<number>(0);

  const [outsideSelectIndex, setOutsideSelectIndex] = useState(0);
  const [scrollSelectIndex, setScrollSelectIndex] = useState(-1);

  const getIndex = useCallback((nativePageY: number) => {
    if (!indexInfoRef.current) return;
    const { pageY, height, indexHeight } = indexInfoRef.current;
    const nativeClientY = nativePageY - pageY;
    if (nativeClientY < 0 || nativeClientY > height) return;
    return Math.floor(nativeClientY / indexHeight);
  }, []);
  const selectIndex = useMemo(
    () => (scrollSelectIndex !== -1 ? scrollSelectIndex : outsideSelectIndex),
    [outsideSelectIndex, scrollSelectIndex],
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      setSelectIndex: setOutsideSelectIndex,
    }),
    [],
  );

  const setCurrentIndex = useCallback(
    (nativePageY: number) => {
      if (!indexInfoRef.current) return;
      const { currentIndex, indexHeight } = indexInfoRef.current;
      const nowIndex = getIndex(nativePageY);
      if (nowIndex !== undefined && nowIndex !== currentIndex) {
        indexInfoRef.current.currentIndex = nowIndex;
        onPress?.(nowIndex);
        popoverRef.current?.setPopoverInfo({ top: nowIndex * indexHeight, text: data[nowIndex], indexHeight });
        setScrollSelectIndex(nowIndex);
      }
    },
    [data, getIndex, onPress],
  );

  const onPanResponderStart: PanResponderCallbacks['onPanResponderStart'] = useCallback(
    async (evt: { nativeEvent: { pageY: any } }) => {
      const eventPageY = evt.nativeEvent.pageY;
      if (indexInfoRef.current && dataLength.current === data.length) {
        indexInfoRef.current.currentIndex = -1;
      } else {
        const { height, pageX, pageY, indexHeight } = await new Promise<PageLocationType>((resolve, reject) => {
          if (indexRef.current === null) {
            reject('no indexRef');
            return;
          }
          indexRef.current.measure((_x, _y, _width, _height, _pageX, _pageY) => {
            resolve({
              height: _height,
              pageX: _pageX,
              pageY: _pageY,
              indexHeight: _height / data.length,
            });
          });
        });
        indexInfoRef.current = {
          height,
          pageX,
          pageY,
          indexHeight,
          currentIndex: -1,
        };
        dataLength.current = data.length;
      }
      setCurrentIndex(eventPageY);
    },
    [data, setCurrentIndex],
  );
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderStart,
        onPanResponderMove: (evt: GestureResponderEvent) => {
          popoverRef.current?.setShow(true);
          setCurrentIndex(evt.nativeEvent.pageY);
        },
        onPanResponderEnd: () => {
          popoverRef.current?.setPopoverInfo(undefined);
          popoverRef.current?.setShow(false);
          setScrollSelectIndex(-1);
        },
      }),
    [onPanResponderStart, setCurrentIndex],
  );
  const indexBarItem = useCallback(
    (item: string, index: number) => {
      return (
        <IndexBarItem
          key={index}
          isSelected={!disableIndexSelect && selectIndex === index}
          style={[styles.indexBarItemStyle, indexBarItemStyle]}
          indexTextStyle={indexTextStyle}
          indexWrapStyle={styles.indexWrapStyle}
          indexWrapSelectStyle={styles.indexWrapSelectStyle}
          indexTextSelectStyle={styles.indexTextSelectStyle}
          text={item}
        />
      );
    },
    [disableIndexSelect, indexBarItemStyle, indexTextStyle, selectIndex],
  );

  return (
    <View style={[styles.barBox, style]} ref={indexRef} {...panResponder.panHandlers}>
      {showPopover && <Popover ref={popoverRef} />}
      {data?.map(indexBarItem)}
    </View>
  );
});

export default IndexBar;

const styles = StyleSheet.create({
  indexTextStyle: {
    color: defaultColors.font3,
    width: pTd(15),
    height: pTd(15),
    lineHeight: pTd(15),
    textAlign: 'center',
  },
  indexBarItemStyle: {
    flex: 1,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    position: 'absolute',
    right: 30,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: defaultColors.bg6,
  },
  popoverItem: {},
  barBox: {
    position: 'absolute',
    right: pTd(4),
  },
  indexWrapStyle: {
    width: pTd(15),
    height: pTd(15),
    borderRadius: pTd(7.5),
    overflow: 'hidden',
  },
  indexWrapSelectStyle: {
    backgroundColor: defaultColors.bg5,
  },
  indexTextSelectStyle: {
    color: defaultColors.font11,
  },
});
