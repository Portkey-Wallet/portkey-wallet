import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback, useRef } from 'react';
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import Open1 from '../../img/Open_01.png';
import Open2 from '../../img/Open_02.png';
import Open3 from '../../img/Open_03.png';
import Open4 from '../../img/Open_04.png';
import Open5 from '../../img/Open_05.png';
import Open6 from '../../img/Open_06.png';
import Touchable from 'components/Touchable';

type OpenPacketButtonProps = {
  onPress?: () => void;
  imgArray?: any[];
  wrapStyle?: StyleProp<ViewStyle> | undefined;
};

export type OpenPacketButtonInstance = {
  startRotate: () => void;
  stopRotate: () => void;
  destroyDom: () => void;
};

export const OpenPacketButton = forwardRef(function OpenPacketButton(props: OpenPacketButtonProps, ref) {
  const { imgArray = [Open1, Open2, Open3, Open4, Open5, Open6], wrapStyle = {}, onPress } = props;
  const len = imgArray.length;

  const [distorted, setDistorted] = useState(false);
  const [currentBgImgIndex, setCurrentBgImgIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const [isDisabled, setIsDisabled] = useState(false);

  const startRotate = useCallback(() => {
    setIsDisabled(true);
    timerRef.current = setInterval(() => {
      setCurrentBgImgIndex(pre => {
        if (pre + 1 === len) return 0;
        return pre + 1;
      });
    }, 100);
  }, [len]);

  const stopRotate = useCallback(() => {
    setIsDisabled(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentBgImgIndex(0);
  }, []);

  const destroyDom = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = undefined;
    setDistorted(true);
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        startRotate,
        stopRotate,
        destroyDom,
      };
    },
    [startRotate, stopRotate, destroyDom],
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    },
    [],
  );

  if (distorted) return null;

  return (
    <Touchable disabled={isDisabled} style={wrapStyle} onPress={onPress}>
      <Image source={imgArray[currentBgImgIndex]} style={styles.imgStyle} />
    </Touchable>
  );
});

export default OpenPacketButton;

const styles = StyleSheet.create({
  imgStyle: {
    width: pTd(88),
    height: pTd(88),
  },
});
