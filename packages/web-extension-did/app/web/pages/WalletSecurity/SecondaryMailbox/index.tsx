import { useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo } from 'react';
import { useNavigateState } from 'hooks/router';
import { Button, Input } from 'antd';
import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import './index.less';

export default function SecondaryMailbox() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigateState();
  const { secondaryEmail } = useIsSecondaryMailSet();

  const goBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);
  const goEdit = useCallback(() => {
    navigate('/setting/wallet-security/secondary-mailbox-edit', { state: { email: secondaryEmail } });
  }, [navigate, secondaryEmail]);
  const mainContent = useMemo(() => {
    return (
      <div
        className={clsx(
          'flex-column-between',
          'flex-1',
          'secondary-mailbox-body',
          isNotLessThan768 ? 'secondary-mailbox-body-prompt' : 'secondary-mailbox-body-popup',
        )}>
        <div>
          <div className="mailbox-container">
            <div className="mailbox-label">{`Backup Mailbox`}</div>
            <Input placeholder="Not Set up" value={secondaryEmail} disabled />
          </div>
          <div className="mailbox-tip flex-column">
            <div>{`Before authorizing, signing transactions, or performing similar operations, notifications will be sent to the mailbox associated with your login account.`}</div>
            <div>{`If your login account cannot receive emails, they will be sent to the backup mailbox you have set up.`}</div>
          </div>
        </div>
        <Button type="primary" onClick={goEdit}>
          Edit
        </Button>
      </div>
    );
  }, [goEdit, isNotLessThan768, secondaryEmail]);

  return isNotLessThan768 ? (
    <div className="secondary-mailbox-page flex-column-between secondary-mailbox-prompt">
      <SecondPageHeader title={`Details`} leftCallBack={goBack} />
      {mainContent}
    </div>
  ) : (
    <div className="secondary-mailbox-page flex-column-between secondary-mailbox-popup">
      <CommonHeader className="popup-header-wrap" title={`Details`} onLeftBack={goBack} />
      {mainContent}
    </div>
  );
}
