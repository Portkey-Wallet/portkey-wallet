import { useCopyToClipboard } from 'react-use';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import singleMessage from 'utils/singleMessage';

export default function Copy({
  toCopy,
  children,
  className,
  iconType,
  iconClassName,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  iconType?: string;
  iconClassName?: string;
}) {
  const { t } = useTranslation();
  const [, setCopied] = useCopyToClipboard();

  return (
    <span
      onClick={() => {
        setCopied(toCopy);
        singleMessage.success(t('Copy Success'));
      }}
      className={clsx('flex-row-center copy-wrapper', className)}
      // eslint-disable-next-line no-inline-styles/no-inline-styles
      style={{ cursor: 'pointer' }}>
      <CustomSvg type={(iconType as any) || 'Copy2'} className={clsx(['icon', iconClassName])} />
      {children}
    </span>
  );
}
