import { ReactNode } from 'react';
import CommonHeader, { CustomSvgPlaceholderSize } from 'components/CommonHeader';

interface ICommonCloseHeaderProps {
  className?: string;
  title?: ReactNode;
  onClose: () => void;
}

export default function CommonCloseHeader({ className, title, onClose }: ICommonCloseHeaderProps) {
  return (
    <CommonHeader
      className={className}
      title={title}
      rightElementList={[
        {
          customSvgType: 'SuggestClose',
          customSvgPlaceholderSize: CustomSvgPlaceholderSize.MD,
          onClick: onClose,
        },
      ]}
    />
  );
}
