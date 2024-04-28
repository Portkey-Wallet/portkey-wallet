import { useLocation, useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import MyQRCodePopup from './Popup';
import MyQRCodePrompt from './Prompt';
import { useCallback, useMemo } from 'react';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

export interface IMyQRCodeProps {
  onBack: () => void;
  qrCodeValue: string;
  showName: string;
  desc: string;
  icon?: string;
}

const qrCodeDesc = 'Scan my QR code to start Portkey chat';

const MyQRCode = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const isShowChat = useIsChatShow();
  const userInfo = useCurrentUserInfo();
  const { isNotLessThan768 } = useCommonState();
  const shareLink = useMemo(() => LinkPortkeyPath.addContact + userInfo?.userId, [userInfo?.userId]);
  const showDesc = useMemo(() => (isShowChat ? qrCodeDesc : ''), [isShowChat]);
  const handleBack = useCallback(() => {
    const _path = pathname.toLowerCase();
    if (_path.includes('contacts')) return navigate('/setting/contacts/find-more', { state });
    if (_path.includes('wallet-name')) return navigate('/setting/wallet/wallet-name', { state });
    return navigate(-1);
  }, [navigate, pathname, state]);
  return isNotLessThan768 ? (
    <MyQRCodePrompt
      icon={userInfo?.avatar}
      onBack={handleBack}
      qrCodeValue={shareLink}
      showName={userInfo?.nickName || ''}
      desc={showDesc}
    />
  ) : (
    <MyQRCodePopup
      icon={userInfo?.avatar}
      onBack={handleBack}
      qrCodeValue={shareLink}
      showName={userInfo?.nickName || ''}
      desc={showDesc}
    />
  );
};
export default MyQRCode;
