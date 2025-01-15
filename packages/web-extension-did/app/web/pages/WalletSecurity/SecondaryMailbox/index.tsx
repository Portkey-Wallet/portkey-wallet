import { useCallback } from 'react';
import { useNavigateState } from 'hooks/router';
import { Button } from 'antd';
import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import { PromptCardType } from '@portkey/did-ui-react/dist/_types/src/components/CommonPromptCard';
import { CommonPromptCard } from '@portkey/did-ui-react';
import './Edit/index.less';
import { CustomSvgV3 } from '../../../components/CustomSvgV3';

export default function SecondaryMailbox() {
  const navigate = useNavigateState();
  const { secondaryEmail } = useIsSecondaryMailSet();

  const goBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);
  const goEdit = useCallback(() => {
    navigate('/setting/wallet-security/secondary-mailbox-edit', { state: { email: secondaryEmail } });
  }, [navigate, secondaryEmail]);

  return (
    <div className="secondary-mailbox-page flex-column-between secondary-mailbox-popup">
      <CommonHeader className="popup-header-wrap" title={`Backup Email`} onLeftBack={goBack} />
      <div className={clsx('flex-column-between', 'flex-1', 'secondary-mailbox-body', 'secondary-mailbox-body-popup')}>
        <div>
          <div className="mailbox-container">
            <div className="mailbox-label">{`Backup Mailbox`}</div>
            <div className="common-card">
              <CustomSvgV3 type="Guardians=Email" className="guardians-email-icon" />
              <div>{secondaryEmail}</div>
            </div>
          </div>
          <CommonPromptCard
            className="mailbox-tip"
            title=""
            type={'info' as PromptCardType}
            description="Notifications for authorizing or signing transactions will be sent to your guardian's email. If unavailable, they'll go to your backup email."
          />
        </div>
        <Button type="primary" onClick={goEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
}
