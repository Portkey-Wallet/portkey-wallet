import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { ChannelItem, Message } from '@portkey-wallet/im';
import { MessageContentType } from '@portkey-wallet/im-ui-web';
import { message, Modal } from 'antd';
import { useCallback } from 'react';

export interface HandleProps {
  info?: ChannelItem;
  list: Message[];
  deleteMessage: (message: Message) => Promise<void>;
  pin: (value: boolean) => Promise<void>;
  mute: (value: boolean) => Promise<void>;
  pinMsg?: (message: Message) => Promise<void>;
  unPinMsg?: (message: Message) => Promise<void>;
}
export const useHandle = ({ deleteMessage, pin, info, mute, list, pinMsg, unPinMsg }: HandleProps) => {
  const handleDeleteMsg = useCallback(
    async (item: MessageContentType) => {
      const msg = list.find((temp) => temp.id === item.id);
      try {
        await deleteMessage(msg as Message);
      } catch (e) {
        message.error('Failed to delete message');
        console.log('===handle delete message error', e);
      }
    },
    [deleteMessage, list],
  );
  const handlePin = useCallback(async () => {
    try {
      await pin(!info?.pin);
    } catch (e: any) {
      if (`${e?.code}` === PIN_LIMIT_EXCEED) {
        message.error('Pin limit exceeded');
      } else {
        message.error(`Failed to ${info?.pin ? 'unpin' : 'pin'} chat`);
      }
      console.log('===handle pin error', e);
    }
  }, [info?.pin, pin]);
  const handleMute = useCallback(async () => {
    try {
      await mute(!info?.mute);
    } catch (e) {
      message.error(`Failed to ${info?.mute ? 'unmute' : 'mute'} chat`);
      console.log('===handle mute error', e);
    }
  }, [info?.mute, mute]);
  const handlePinMsg = useCallback(
    async (item: MessageContentType) => {
      const msg: Message | undefined = list.find((temp) => temp.id === item.id);
      if (!msg) return;
      if (msg.pinInfo) {
        Modal.confirm({
          width: 320,
          content: (
            <div className="unpin-content flex-column-center">
              <div className="unpin-content-title">Unpin Message</div>
              <div>Do you like to unpin this message?</div>
            </div>
          ),
          className: 'cross-modal unpin-modal',
          autoFocusButton: null,
          icon: null,
          centered: true,
          okText: 'Unpin',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await unPinMsg?.(msg);
            } catch (e) {
              message.error('Failed to unpin message');
              console.log('===handle unpin message error', e);
            }
          },
        });
      } else {
        try {
          await pinMsg?.({ ...msg });
        } catch (e) {
          message.error('Failed to pin message');
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
