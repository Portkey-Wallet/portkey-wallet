import { useCopyToClipboard } from 'react-use';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import singleMessage from 'utils/singleMessage';

export default function Copy({
  toCopy,
  children,
  className,
  iconType,
  iconClassName,
  fillColor,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  iconType?: string;
  iconClassName?: string;
  fillColor?: string;
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
      {/*<CustomSvg type={(iconType as any) || 'Copy2'} className={clsx(['icon', iconClassName])} />*/}
      <CustomSvgV3 type={(iconType as any) || 'Copy'} className={clsx(['icon', iconClassName])} fillColor={fillColor} />
      {children}
    </span>
  );
}
