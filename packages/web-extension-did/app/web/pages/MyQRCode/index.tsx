import { useLocation, useNavigate } from 'react-router';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import MyQRCodePopup from './Popup';
import MyQRCodePrompt from './Prompt';
import { useCallback, useMemo } from 'react';

export interface IMyQRCodeProps {
  onBack: () => void;
  qrCodeValue: string;
  showName: string;
  desc: string;
}

const qrCodeDesc = 'Scan my QR code to start Portkey chat';

const MyQRCode = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { walletName, userId } = useWalletInfo();
  const { isNotLessThan768 } = useCommonState();
  const shareLink = useMemo(() => LinkPortkeyPath.addContact + userId, [userId]);
  const handleBack = useCallback(() => {
    const _path = pathname.toLowerCase();
    if (_path.includes('contacts')) return navigate('/setting/contacts/find-more', { state });
    if (_path.includes('wallet-name')) return navigate('/setting/wallet/wallet-name', { state });
    return navigate(-1);
  }, [navigate, pathname, state]);
  return isNotLessThan768 ? (
    <MyQRCodePrompt onBack={handleBack} qrCodeValue={shareLink} showName={walletName} desc={qrCodeDesc} />
  ) : (
    <MyQRCodePopup onBack={handleBack} qrCodeValue={shareLink} showName={walletName} desc={qrCodeDesc} />
  );
};
export default MyQRCode;
