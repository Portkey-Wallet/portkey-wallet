import TitleWrapper, { TitleWrapperProps } from 'components/TitleWrapper';
import { useNavigate } from 'react-router';

export default function BackHeader({ title, leftCallBack, rightElement }: TitleWrapperProps) {
  const navigate = useNavigate();

  return (
    <div>
      <TitleWrapper
        className="back-header-wrapper"
        title={title}
        leftCallBack={() => (leftCallBack ? leftCallBack() : navigate(-1))}
        rightElement={rightElement}
      />
    </div>
  );
}
