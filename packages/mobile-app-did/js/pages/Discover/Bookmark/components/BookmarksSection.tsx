import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { FlatList, LayoutAnimation, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context/bookmarksContext';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import myEvents from 'utils/deviceEvent';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { nextAnimation } from 'utils/animation';

const mockData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function BookmarksSection() {
  const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();

  const BottomBox = useMemo(
    () => (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton
              onPress={() => {
                nextAnimation();
                dispatch(setEdit(false));
              }}
              title="Done"
              type="primary"
            />
            <CommonButton
              containerStyle={styles.deleteAll}
              titleStyle={FontStyles.font12}
              type="outline"
              title="Delete All"
            />
          </>
        ) : (
          <CommonButton
            onPress={() => {
              nextAnimation();
              dispatch(setEdit(true));
            }}
            title="Edit"
            type="primary"
          />
        )}
      </View>
    ),
    [dispatch, isEdit],
  );
  const closeSwipeable = useLockCallback(() => myEvents.bookmark.closeSwipeable.emit(), []);
  if (list.length === 0) return <NoDiscoverData location="top" size="large" backgroundColor={defaultColors.bg4} />;
  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flex1, styles.listWrap]}>
        <DraggableFlatList
          scrollEnabled
          data={list}
          onTouchStart={closeSwipeable}
          ListHeaderComponent={<View style={styles.headerBlank} />}
          ListFooterComponent={<View style={styles.footerBlank} />}
          keyExtractor={_item => _item}
          renderItem={props => <BookmarkItem {...props} />}
          onDragEnd={({ data }) => setList(data)}
        />
      </View>
      {BottomBox}
    </View>
  );
}

export default function Container() {
  return (
    <BookmarkProvider>
      <BookmarksSection />
    </BookmarkProvider>
  );
}

const styles = StyleSheet.create({
  // remove padding to scale item
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: pTd(6),
  },
  listWrap: {
    paddingHorizontal: pTd(20),
  },
  buttonGroupWrap: {
    paddingHorizontal: pTd(20),
  },
  deleteAll: {
    marginTop: pTd(10),
  },
  headerBlank: {
    borderTopLeftRadius: pTd(6),
    borderTopRightRadius: pTd(6),
    height: pTd(8),
    backgroundColor: defaultColors.bg1,
  },
  footerBlank: {
    borderBottomLeftRadius: pTd(6),
    borderBottomRightRadius: pTd(6),
    height: pTd(8),
    backgroundColor: defaultColors.bg1,
  },
});
