import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useUpgradeModal } from 'hooks/useUpgrade';
import './index.less';

export default function UpgradeTip() {
  const showUpgradeModal = useUpgradeModal({ forceShow: true });
  return (
    <div className="my-wallet-upgrade-tip flex-between-center">
      <div className="upgrade-container flex-center">
        <CustomSvg type="UpgradeIcon" />
        <div className="upgrade-content flex-center">
          <div className="upgrade-content-title">Portkey Upgraded</div>
          <div className="upgrade-content-subtitle">With enhanced user experience!</div>
        </div>
      </div>
      <Button className="upgrade-btn" type="primary" onClick={showUpgradeModal}>
        Upgrade
      </Button>
    </div>
  );
}
