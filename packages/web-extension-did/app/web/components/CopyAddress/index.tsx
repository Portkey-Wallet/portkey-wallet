import { useMemo, useState, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import CommonTooltip from 'components/CommonTooltip';
import './index.less';
import CustomSvg from 'components/CustomSvg';

export enum CopySize {
  Small = 'small',
  Normal = 'normal',
}

export default function Copy({
  toCopy,
  children,
  className,
  size = CopySize.Normal,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  size?: CopySize;
}) {
  // const { isMobilePX } = useCommonState();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCopyValue] = useCopyToClipboard();
  const [isShowCopyIcon, setIsShowCopyIcon] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const CopyIcon = useMemo(
    () =>
      size === CopySize.Small ? (
        <CustomSvg type="CopySmall" className="copy-svg" />
      ) : (
        <CustomSvg type="Copy5" className="copy-svg" />
      ),
    [size],
  );
  const CheckIcon = useMemo(
    () =>
      size === CopySize.Small ? (
        <CustomSvg type="CheckSmall" className="copy-svg" />
      ) : (
        <CustomSvg type="Check" className="copy-svg" />
      ),
    [size],
  );

  const tooltipTitle = useMemo(() => {
    if (isShowCopyIcon) {
      return 'Copied';
    }
    return 'Copy';
  }, [isShowCopyIcon]);

  return (
    <CommonTooltip
      title={tooltipTitle}
      trigger={'hover'}
      open={isTooltipOpen}
      overlayClassName="common-tooltip-overlay">
      <span
        onClick={() => {
          if (isShowCopyIcon) {
            return;
          }
          setCopyValue(toCopy);
          setIsShowCopyIcon(true);
          setIsTooltipOpen(true);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            setIsTooltipOpen(false);
            setIsShowCopyIcon(false);
          }, 2000);
        }}
        onMouseEnter={() => {
          setIsTooltipOpen(true);
        }}
        onMouseLeave={() => {
          setIsTooltipOpen(false);
        }}
        className={`flex-center cursor-pointer copy-icon-wrapper copy-icon-wrapper-background-color copy-icon-wrapper-${size} ${className}`}>
        {isShowCopyIcon ? CheckIcon : CopyIcon}
        {children}
      </span>
    </CommonTooltip>
  );
}
