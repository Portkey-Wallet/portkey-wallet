import { ChannelItem } from '@portkey-wallet/im';
import { MessageType } from '@portkey-wallet/im-ui-web';
import { message } from 'antd';
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
      if (`${e?.code}` === '13310') {
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
  return {
    handleDeleteMsg,
    handlePin,
    handleMute,
  };
};
