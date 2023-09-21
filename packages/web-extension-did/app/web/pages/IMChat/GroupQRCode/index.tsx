import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useMemo } from 'react';
import ShowQRCode from 'pages/components/ShowQRCode';
import { LinkPortkeyPath, LinkPortkeyWebsite } from '@portkey-wallet/constants/constants-ca/network';

const GroupQRCode = () => {
  const { channelUuid } = useParams();
  const { groupInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const shareLink = useMemo(() => LinkPortkeyWebsite + LinkPortkeyPath.addGroup + channelUuid, [channelUuid]);
  const navigate = useNavigate();

  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      console.log('===Failed to refresh error', error);
      message.error('Failed to fetch data');
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
        isGroup
        qrCodeValue={shareLink}
        showName={groupInfo?.name || 'Group Info'}
        desc="Scan QR code to invite friends chat in group"
      />
    </div>
  );
};
export default GroupQRCode;
