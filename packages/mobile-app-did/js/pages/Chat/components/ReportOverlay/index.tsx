import { StyleSheet, View, Keyboard, TextInput, ScrollView } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody, ModalBodyProps } from 'components/ModalBody';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import { TopSpacing } from '../hooks';
import { sleep } from '@portkey-wallet/utils';
import { ReportMessageEnum, ReportMessageList } from '@portkey-wallet/constants/constants-ca/chat';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import CommonToast from 'components/CommonToast';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCurrentChannelId } from 'pages/Chat/context/hooks';

export interface ReportOverlayPropsTypes {
  message: string;
  messageId: string;
  reportedRelationId: string;
}

function ReportOverlay(props: ReportOverlayPropsTypes) {
  const [selectedType, setSelectedType] = useState<ReportMessageEnum>(ReportMessageEnum.Spam);
  const [content, setContent] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(TopSpacing);
  const { reportMessage } = useBlockAndReport();
  const currentChannelId = useCurrentChannelId();

  const isReportButtonDisable = useMemo(
    () => selectedType === ReportMessageEnum.Other && !content.trim(),
    [content, selectedType],
  );

  const scrollToBottom = useCallback(async () => {
    await sleep(500);
    scrollViewRef.current?.scrollToEnd();
  }, []);

  const bottomButtonGroup = useMemo(
    (): ModalBodyProps['bottomButtonGroup'] => [
      {
        title: 'Cancel',
        type: 'outline',
        onPress: OverlayModal.hide,
      },
      {
        disabled: isReportButtonDisable,
        title: 'Report',
        type: 'primary',
        onPress: async () => {
          try {
            OverlayModal.hide();
            await reportMessage({
              ...props,
              reportType: selectedType,
              channelUuid: currentChannelId,
              description: selectedType === ReportMessageEnum.Other ? content : '',
            });
            CommonToast.success(
              'Thank you for reporting this. Portkey will look into the matter and take appropriate action to handle it.',
            );
          } catch (error) {
            console.log('error', error);
            CommonToast.failError(error);
          }
        },
      },
    ],
    [content, currentChannelId, isReportButtonDisable, props, reportMessage, selectedType],
  );

  return (
    <ModalBody modalBodyType="bottom" title="Report" bottomButtonGroup={bottomButtonGroup}>
      <ScrollView style={styles.scrollWrap} ref={scrollViewRef}>
        {ReportMessageList.map(ele => (
          <Touchable
            onPress={() => setSelectedType(ele.value)}
            key={ele.value}
            style={[GStyles.flexRow, GStyles.itemCenter, GStyles.height(56)]}>
            <Svg icon={selectedType === ele.value ? 'selected5' : 'unselected'} />
            <TextL style={[FontStyles.font5, GStyles.marginLeft(pTd(12))]}>{ele.title}</TextL>
          </Touchable>
        ))}
        <View style={styles.inputWrap}>
          <TextInput
            editable={selectedType === ReportMessageEnum.Other}
            placeholder="Please enter any additional details relevant to your report."
            multiline
            maxLength={500}
            value={content}
            onChangeText={v => setContent(v)}
            onFocus={scrollToBottom}
            style={styles.input}
          />
        </View>
        {isKeyboardOpened && <View style={GStyles.height(keyboardHeight)} />}
      </ScrollView>
    </ModalBody>
  );
}

export const showReportOverlay = (props: ReportOverlayPropsTypes) => {
  Keyboard.dismiss();
  OverlayModal.show(<ReportOverlay {...props} />, {
    position: 'bottom',
  });
};

export default {
  showReportOverlay,
};

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(50),
  },
  scrollWrap: {
    marginTop: pTd(8),
    paddingHorizontal: pTd(16),
  },
  inputWrap: {
    marginTop: -pTd(8),
    marginLeft: pTd(36),
    marginBottom: pTd(20),
    width: pTd(307),
    height: pTd(80),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border9,
    padding: pTd(12),
  },
  input: {
    fontSize: pTd(16),
    width: '100%',
    height: '100%',
  },
});
