import { Tooltip, TooltipProps } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import './index.less';

// interface CommonTooltipProps extends TooltipProps {

// }
export default function CommonTooltip({ ...props }: TooltipProps) {
  return (
    <Tooltip getPopupContainer={(v) => v} overlayClassName={clsx('common-tooltip', props.overlayClassName)} {...props}>
      {props.children ? props.children : <CustomSvg type="tooltip" />}
    </Tooltip>
  );
}
