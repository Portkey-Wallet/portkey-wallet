import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function DappAutoTx() {
  return (
    <div className="auto-tx flex-column-center">
      <div className="auto-title flex-center">
        <CustomSvg type="PortKey" />
        <span>PORTKEY</span>
      </div>
      <div className="loading"></div>
      <div className="content">
        <span>The transaction is being automatically processed, please </span>
        <span className="high-light">DO NOT</span>
        <span> close the window.</span>
      </div>
      <span className="tip">{`Please allow this window to close on its own upon transaction completion. Manually closing it could result in termination of the transaction or potential errors.`}</span>
    </div>
  );
}
