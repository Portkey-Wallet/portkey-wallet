import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { ChannelItem, Message } from '@portkey-wallet/im';
import { MessageContentType } from '@portkey-wallet/im-ui-web';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import { useCallback } from 'react';
import singleMessage from 'utils/singleMessage';

export interface HandleProps {
  info?: ChannelItem;
  list: Message[];
  deleteMessage: (message: Message) => Promise<void>;
  pin: (value: boolean) => Promise<void>;
  mute: (value: boolean) => Promise<void>;
  pinMsg?: (message: Message) => Promise<void>;
  unPinMsg?: (message: Message) => Promise<void>;
  refreshAllPinList?: () => Promise<void>;
}
export const useHandle = ({
  deleteMessage,
  pin,
  info,
  mute,
  list,
  pinMsg,
  unPinMsg,
  refreshAllPinList,
}: HandleProps) => {
  const handleDeleteMsg = useCallback(
    async (item: MessageContentType) => {
      const msg = list.find((temp) => temp.id === item.id);
      try {
        await deleteMessage(msg as Message);
        await sleep(200);
        refreshAllPinList?.();
      } catch (e) {
        singleMessage.error('Failed to delete message');
        console.log('===handle delete message error', e);
      }
    },
    [deleteMessage, list, refreshAllPinList],
  );
  const handlePin = useCallback(async () => {
    try {
      await pin(!info?.pin);
    } catch (e: any) {
      if (`${e?.code}` === PIN_LIMIT_EXCEED) {
        singleMessage.error('Pin limit exceeded');
      } else {
        singleMessage.error(`Failed to ${info?.pin ? 'unpin' : 'pin'} chat`);
      }
      console.log('===handle pin error', e);
    }
  }, [info?.pin, pin]);
  const handleMute = useCallback(async () => {
    try {
      await mute(!info?.mute);
    } catch (e) {
      singleMessage.error(`Failed to ${info?.mute ? 'unmute' : 'mute'} chat`);
      console.log('===handle mute error', e);
    }
  }, [info?.mute, mute]);
  const handlePinMsg = useCallback(
    async (item: MessageContentType) => {
      const msg: Message | undefined = list.find((temp) => temp.id === item.id);
      if (!msg) return;
      if (msg.pinInfo) {
        CustomModalConfirm({
          content: (
            <div className="modal-unpin-content flex-column-center">
              <div className="unpin-content-title">Unpin Message</div>
              <div>Would you like to unpin this message?</div>
            </div>
          ),
          okText: 'Unpin',
          onOk: async () => {
            try {
              unPinMsg?.(msg);
            } catch (e) {
              const _err = handleErrorMessage(e, 'Failed to unpin message');
              singleMessage.error(_err);
              console.log('===handle unpin message error', e);
            }
          },
        });
      } else {
        try {
          await pinMsg?.({ ...msg });
        } catch (e) {
          const _err = handleErrorMessage(e, 'Failed to pin message');
          singleMessage.error(_err);
          console.log('===handle pin message error', e);
        }
      }
    },
    [list, pinMsg, unPinMsg],
  );
  return {
    handleDeleteMsg,
    handlePin,
    handleMute,
    handlePinMsg,
  };
};
