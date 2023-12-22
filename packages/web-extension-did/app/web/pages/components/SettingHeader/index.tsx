import TitleWrapper, { TitleWrapperProps } from 'components/TitleWrapper';
import { useNavigate } from 'react-router';
import './index.less';

export default function SettingHeader({ title, leftCallBack, rightElement }: TitleWrapperProps) {
  const navigate = useNavigate();

  return (
    <TitleWrapper
      className="setting-header-wrapper"
      title={title}
      leftCallBack={() => (leftCallBack ? leftCallBack() : navigate(-1))}
      rightElement={rightElement}
    />
  );
}
