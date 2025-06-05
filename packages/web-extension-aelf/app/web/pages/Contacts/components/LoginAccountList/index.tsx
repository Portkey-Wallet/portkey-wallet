import { CONTACT_PRIVACY_TYPE_LABEL_MAP } from '@portkey-wallet/constants/constants-ca/contact';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Copy from 'components/Copy';
import { useCallback } from 'react';
import './index.less';
import { IContactProfileLoginAccount } from '@portkey-wallet/types/types-ca/contact';

export type ILoginAccountListProps = {
  [X in keyof typeof LoginType]: IContactProfileLoginAccount[];
};

export default function LoginAccountList({ Email, Phone, Google, Apple }: Partial<ILoginAccountListProps>) {
  const identifierItem = useCallback((list: IContactProfileLoginAccount[]) => {
    return (
      <div className="login-account-list-section">
        <div className="login-account-label">{CONTACT_PRIVACY_TYPE_LABEL_MAP[list[0]?.privacyType]}</div>
        {list.map((item) => {
          return (
            <div key={item.privacyType + item.identifier} className="flex-row-between login-account-identifier-row">
              <div className="login-account-identifier">{item.identifier}</div>
              <Copy toCopy={item.identifier} iconType="Copy4" />
            </div>
          );
        })}
      </div>
    );
  }, []);

  return (
    <div className="login-account-list">
      {Array.isArray(Phone) && Phone?.length > 0 && identifierItem(Phone)}

      {Array.isArray(Email) && Email?.length > 0 && identifierItem(Email)}

      {Array.isArray(Google) && Google?.length > 0 && identifierItem(Google)}

      {Array.isArray(Apple) && Apple?.length > 0 && identifierItem(Apple)}
    </div>
  );
}
