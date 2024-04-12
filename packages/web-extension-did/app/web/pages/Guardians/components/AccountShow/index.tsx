import { StoreUserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import './index.less';

export default function AccountShow({ guardian }: { guardian: StoreUserGuardianItem | undefined }) {
  switch (guardian?.guardianType) {
    case LoginType.Email:
    case LoginType.Phone:
      return <div className="account account-text-one-row">{guardian.guardianAccount}</div>;
    case LoginType.Google:
    case LoginType.Apple:
    case LoginType.Telegram:
    case LoginType.Twitter:
    case LoginType.Facebook:
      return (
        <div className="account account-text-two-row flex-column">
          <span className="name">{guardian.firstName}</span>
          <span className="detail">{guardian.isPrivate ? '******' : guardian.thirdPartyEmail}</span>
        </div>
      );
    default:
      return null;
  }
}
