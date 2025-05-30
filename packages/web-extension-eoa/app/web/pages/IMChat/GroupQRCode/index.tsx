import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { useParams } from 'react-router';
import { useCallback, useEffect, useMemo } from 'react';
import ShowQRCode from 'pages/components/ShowQRCode';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';

const GroupQRCode = () => {
  const { channelUuid } = useParams();
  const { groupInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const shareLink = useMemo(() => LinkPortkeyPath.addGroup + channelUuid, [channelUuid]);
  const navigate = useNavigateState();

  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      console.log('===Failed to refresh error', error);
      singleMessage.error('Failed to fetch data');
    }
  }, [refresh]);
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="group-share-page">
      <ShowQRCode
        onBack={() => navigate(-1)}
        type={ChannelTypeEnum.GROUP}
        qrCodeValue={shareLink}
        icon={groupInfo?.icon}
        showName={groupInfo?.name || 'Group Info'}
        desc="Scan this QR code to join the group"
      />
    </div>
  );
};
export default GroupQRCode;
