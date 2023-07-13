import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { useBookmark } from '../context';
import usePrevious from 'hooks/usePrevious';
import { BGStyles } from 'assets/theme/styles';

export default memo(
  function BookmarkItem(props: RenderItemParams<string>) {
    const { drag, isActive, item } = props;
    const swipeableRef = useRef<SwipeableItemImperativeRef>(null);
    const [{ isEdit }] = useBookmark();
    const preIsEdit = usePrevious(isEdit);
    useEffect(() => {
      if (!isEdit && isEdit !== preIsEdit) swipeableRef.current?.close();
    }, [preIsEdit, isEdit]);

    const renderUnderlayLeft = useCallback(
      () => (
        <Touchable style={styles.underlayLeftBox} onPress={() => swipeableRef.current?.close()}>
          <TextM>close</TextM>
        </Touchable>
      ),
      [],
    );

    return (
      <ScaleDecorator activeScale={1.05}>
        <SwipeableItem
          key={item}
          item={props}
          ref={swipeableRef}
          swipeEnabled={false}
          snapPointsLeft={[80]}
          renderUnderlayLeft={renderUnderlayLeft}>
          <View
            // disabled={!isEdit || isActive}
            style={[
              GStyles.flexRow,
              styles.itemRow,
              BGStyles.bg2,
              // add margin to scale item
              styles.marginContainer,
            ]}>
            {isEdit && (
              <Touchable onPress={() => swipeableRef.current?.open(OpenDirection.LEFT)}>
                <TextM>open</TextM>
              </Touchable>
            )}

            <TextM>{item}</TextM>
            {/* <Touchable onPressIn={drag} disabled={!isEdit || isActive}>
              <TextM>drag</TextM>
            </Touchable> */}
          </View>
        </SwipeableItem>
      </ScaleDecorator>
    );
  },
  (prevProps: RenderItemParams<string>, nextProps: RenderItemParams<string>) => {
    return prevProps.item === nextProps.item && prevProps.isActive === nextProps.isActive;
  },
);

const styles = StyleSheet.create({
  marginContainer: {
    // marginHorizontal: 16,
  },
  underlayLeftBox: {
    flex: 1,
    paddingRight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    justifyContent: 'flex-end',
  },
  itemRow: {
    padding: 20,
    height: 80,
    marginVertical: 10,
  },
});
