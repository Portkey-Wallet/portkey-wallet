import CustomSvg from 'components/CustomSvg';
import { Button } from 'antd';
import './index.less';

interface IAddContactButtonProps {
  addText: string;
  onAdd: () => void;
  goBack?: () => void;
  isClosed?: boolean;
}
export default function AddContactButton({ onAdd, addText, goBack, isClosed = false }: IAddContactButtonProps) {
  return (
    <div className="flex-center header-right-action">
      <Button onClick={onAdd}>{addText}</Button>
      {isClosed && <CustomSvg type="SuggestClose" onClick={goBack ?? undefined} />}
    </div>
  );
}
