import CustomSvg from 'components/CustomSvg';
import './index.less';

interface IImputationTipProps {
  closeTip: () => void;
}

export default function ImputationTip({ closeTip }: IImputationTipProps) {
  return (
    <div className="flex imputation-tip">
      <CustomSvg type={'Info2'} className="imputation-tip-icon-info" />
      <div className="imputation-tip-text">{`Portkey automatically updates your contact list and group contacts with the same Portkey ID into one. You can click the red mark on the contact for details.`}</div>
      <CustomSvg type={'Close4'} className="imputation-tip-icon-close" onClick={closeTip} />
    </div>
  );
}
