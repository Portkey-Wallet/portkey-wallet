import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { ChannelItem } from '@portkey-wallet/im';
import { MessageType } from '@portkey-wallet/im-ui-web';
import { message, Modal } from 'antd';
import { useCallback } from 'react';

export interface HandleProps {
  info?: ChannelItem;
  deleteMessage: (id?: string | undefined) => Promise<void>;
  pin: (value: boolean) => Promise<void>;
  mute: (value: boolean) => Promise<void>;
}
export const useHandle = ({ deleteMessage, pin, info, mute }: HandleProps) => {
  const handleDeleteMsg = useCallback(
    async (item: MessageType) => {
      try {
        await deleteMessage(`${item.id}`);
      } catch (e) {
        message.error('Failed to delete message');
        console.log('===handle delete message error', e);
      }
    },
    [deleteMessage],
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
    async (item: MessageType) => {
      if (!item.pin) {
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
              // TODO pin
              await deleteMessage(`${item.id}`);
            } catch (e) {
              message.error('Failed to unpin message');
              console.log('===handle unpin message error', e);
            }
          },
        });
      } else {
        try {
          // TODO pin
          await deleteMessage(`${item.id}`);
        } catch (e) {
          message.error('Failed to pin message');
          console.log('===handle pin message error', e);
        }
      }
    },
    [deleteMessage],
  );
  return {
    handleDeleteMsg,
    handlePin,
    handleMute,
    handlePinMsg,
  };
};
