/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';

export const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#222B45',
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

export const renderActions = props => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <Svg icon="add1" />}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderAccessory = props => (
  <View style={styles.toolsWrap}>
    <TouchableOpacity style={styles.toolsItem}>
      <TextM>camera</TextM>
    </TouchableOpacity>

    <TouchableOpacity style={styles.toolsItem}>
      <TextM>photo</TextM>
    </TouchableOpacity>

    <TouchableOpacity style={styles.toolsItem}>
      <TextM>Bookmark</TextM>
    </TouchableOpacity>
  </View>
);

export const renderComposer = props => {
  console.log('renderComposer', props);

  return (
    <Composer
      {...props}
      textInputStyle={{
        color: '#222B45',
        backgroundColor: '#EDF1F7',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E4E9F2',
        paddingTop: 8.5,
        paddingHorizontal: 12,
        marginLeft: 0,
      }}
    />
  );
};

export const renderSend = props => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}>
    <Svg icon="send" color="red" />
  </Send>
);

const styles = StyleSheet.create({
  toolsWrap: {
    height: pTd(50),
    display: 'flex',
    flexDirection: 'row',
  },
  toolsItem: {
    width: '25%',
    margin: pTd(2),
    backgroundColor: 'skyblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
