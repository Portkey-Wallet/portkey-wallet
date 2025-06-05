import CustomSvg from 'components/CustomSvg';

export interface IChatBoxTipProps {
  showClose?: boolean;
  onConfirm: () => any;
  onClose?: () => void;
  children: React.ReactNode;
}

const ChatBoxTip = ({ onClose, onConfirm, showClose = true, children }: IChatBoxTipProps) => {
  return (
    <div className="chat-box-inner-tip">
      <div className="content flex-center" onClick={onConfirm}>
        {children}
      </div>
      {showClose && <CustomSvg type="SuggestClose" onClick={onClose} />}
    </div>
  );
};
export default ChatBoxTip;
