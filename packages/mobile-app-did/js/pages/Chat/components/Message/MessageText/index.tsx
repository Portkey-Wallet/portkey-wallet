import React, { memo } from 'react';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { IMessage, MessageTextProps, Time } from 'react-native-gifted-chat';
import ParsedText from 'react-native-parsed-text';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useThrottleCallback } from '@portkey-wallet/hooks';
const UNICODE_SPACE = isIOS
  ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
  : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
const WWW_URL_PATTERN = /^www\./i;

function MessageText(props: MessageTextProps<IMessage>) {
  const { currentMessage, textProps, position = 'right', customTextStyle, textStyle } = props;
  const jump = useDiscoverJumpWithNetWork();

  const onUrlPress = useThrottleCallback(
    (url: string) => {
      if (WWW_URL_PATTERN.test(url)) {
        onUrlPress(`https://${url}`);
      } else {
        jump({
          item: {
            url: url,
            name: url,
          },
        });
      }
    },
    [jump],
  );

  return (
    <View>
      <Text style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}>
        <ParsedText
          style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}
          parse={[{ type: 'url', style: styles.linkStyle as TextStyle, onPress: onUrlPress }]}
          childrenProps={{ ...textProps }}>
          {currentMessage?.text}
        </ParsedText>
        {UNICODE_SPACE}
      </Text>
      <Time containerStyle={textContainerStyle} {...props} />
    </View>
  );
}

export default memo(MessageText);

const styles = StyleSheet.create({
  textStyles: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  linkStyle: {
    color: 'red',
  },
  timeBoxStyle: {
    position: 'absolute',
    right: 10,
    bottom: 2,
  },
});

const textContainerStyle = {
  left: styles.timeBoxStyle,
  right: styles.timeBoxStyle,
};
const messageStyles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...styles.textStyles,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...styles.textStyles,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};
