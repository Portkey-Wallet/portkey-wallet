import './index.less';
export interface IDepositCommonButton {
  text: string;
  onClick?: () => void;
}
export default function DepositCommonButton(props: IDepositCommonButton) {
  return (
    <button
      className="deposit-button"
      onClick={() => {
        props.onClick?.();
      }}>
      <span className="button-text">{props.text}</span>
    </button>
  );
}
