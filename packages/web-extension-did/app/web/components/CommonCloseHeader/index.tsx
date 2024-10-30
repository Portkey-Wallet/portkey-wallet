import { ReactNode } from 'react';
import CommonHeader, { CustomSvgPlaceholderSize } from 'components/CommonHeader';

interface ICommonCloseHeaderProps {
  className?: string;
  title?: ReactNode;
  onClose: () => void;
  onLeftBack?: () => void;
}

export default function CommonCloseHeader({ className, title, onClose, onLeftBack }: ICommonCloseHeaderProps) {
  return (
    <CommonHeader
      onLeftBack={onLeftBack}
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
