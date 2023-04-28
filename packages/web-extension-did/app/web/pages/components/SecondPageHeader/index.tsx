import clsx from 'clsx';
import TitleWrapper, { TitleWrapperProps } from 'components/TitleWrapper';
import './index.less';

export default function SecondPageHeader({
  className,
  style,
  paddingLeft,
  ...props
}: TitleWrapperProps & { paddingLeft?: number }) {
  return (
    <TitleWrapper
      className={clsx(['second-page-header', 'flex-start-center', className])}
      style={{ paddingLeft: paddingLeft, ...style }}
      {...props}
    />
  );
}
