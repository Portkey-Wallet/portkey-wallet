import React from 'react';
import { Text, Platform } from 'react-native';
import Config from 'react-native-config';
export const logBoxTextColorSaver = () => {
  if (__DEV__ && Config.USE_LOGBOX_SAVER) {
    const originalRender = Text.render;
    Text.render = function (...args) {
      const origin = originalRender.call(this, ...args);
      const oldProps = origin.props;
      const newProps = {
        ...oldProps,
        style: [oldProps.style, Platform.OS === 'ios' ? {} : { color: '#fff' }],
      };
      const newElement = React.cloneElement(origin, newProps, origin.props.children);
      return newElement;
    };
  }
};
