import React from 'react';
import { GiftedChatProps } from 'react-native-gifted-chat';
import { SystemMessage } from 'react-native-gifted-chat';

export const renderSystemMessage: GiftedChatProps['renderSystemMessage'] = props => <SystemMessage {...props} />;
