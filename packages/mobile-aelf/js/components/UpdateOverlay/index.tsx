import React, { useEffect, useState } from 'react';
import OverlayModal from '../OverlayModal';
import { Keyboard, View } from 'react-native';
import { pTd } from 'utils/unit';
import { sleep } from '@portkey-wallet/utils';
import { codePushOperator } from 'utils/update';
import { TextL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { ButtonRowProps } from 'components/ButtonRow';
import { CommonProgress } from 'components/CommonProgress';
import { makeStyles } from '@rneui/themed';

function UpdateBody() {
  const [progress, setProgress] = useState(0);
  const styles = getStyles();
  useEffect(() => {
    const listener = codePushOperator.addProgressListener(p => {
      setProgress(p.receivedBytes / p.totalBytes);
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <ModalBody
      bottomButtonGroup={[{ type: 'outline', title: 'Close', onPress: () => OverlayModal.hide() }]}
      modalBodyType="bottom"
      title={'Downloading...'}>
      <View style={styles.contentWrap}>
        <CommonProgress percent={progress} />
        <TextL
          style={{
            lineHeight: pTd(22),
            marginTop: pTd(12),
          }}>{`You can close this window, and the new version will continue to download in the background.`}</TextL>
      </View>
    </ModalBody>
  );
}

const show = async () => {
  OverlayModal.hide();
  Keyboard.dismiss();
  OverlayModal.show(<UpdateBody />, {
    position: 'bottom',
  });
  await sleep(300);
};

function UpdateTipBody({
  bottomButtonGroup,
  title,
  message,
}: {
  bottomButtonGroup: ButtonRowProps['buttons'];
  title?: string;
  message?: string;
}) {
  const styles = getStyles();

  return (
    <ModalBody
      bottomButtonGroup={bottomButtonGroup}
      modalBodyType="bottom"
      title={title || 'A new Portkey version is available.'}>
      <TextL style={styles.contentWrap}>{message || `Would you like to download it now?`}</TextL>
    </ModalBody>
  );
}

const showTip = async (props: { bottomButtonGroup: ButtonRowProps['buttons']; title?: string; message?: string }) => {
  OverlayModal.hide();
  Keyboard.dismiss();
  OverlayModal.show(<UpdateTipBody {...props} />, {
    position: 'bottom',
  });
};

function DownloadedBody({ bottomButtonGroup }: { bottomButtonGroup: ButtonRowProps['buttons'] }) {
  return (
    <ModalBody
      bottomButtonGroup={bottomButtonGroup}
      modalBodyType="bottom"
      title={`The download is complete. Would you like to update now?`}
    />
  );
}

const showDownloadedTip = async ({ bottomButtonGroup }: { bottomButtonGroup: ButtonRowProps['buttons'] }) => {
  OverlayModal.hide();
  Keyboard.dismiss();
  OverlayModal.show(<DownloadedBody bottomButtonGroup={bottomButtonGroup} />, {
    position: 'bottom',
  });
};

export default {
  show,
  showTip,
  showDownloadedTip,
};

const getStyles = makeStyles(theme => ({
  contentWrap: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
  },
}));
