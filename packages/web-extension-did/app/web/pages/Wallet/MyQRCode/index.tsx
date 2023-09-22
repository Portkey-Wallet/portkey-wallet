import { useNavigate } from 'react-router';
import ShowQRCode from 'pages/components/ShowQRCode';
import { useWalletInfo } from 'store/Provider/hooks';

// TODO
const shareLink = 'https://portkey.finance/sc/ac/';
const MyQRCode = () => {
  const navigate = useNavigate();
  const { walletName, userId } = useWalletInfo();
  return (
    <div className="my-wallet-share-page">
      <ShowQRCode
        onBack={() => navigate(-1)}
        qrCodeValue={`${shareLink}${userId}`}
        showName={walletName || 'Wallet 01'}
        desc="Scan my QR code to start Portkey chat"
      />
    </div>
  );
};
export default MyQRCode;
