import { Tooltip, TooltipProps } from 'antd';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export function CommonTooltip({ ...props }: TooltipProps) {
  return (
    <Tooltip
      className="common-tooltip-container-v2"
      getPopupContainer={(v) => v}
      overlayClassName={clsx('common-tooltip-v2', props.overlayClassName)}
      {...props}>
      {props.children ? props.children : <CustomSvgV3 type="help" />}
    </Tooltip>
  );
}
