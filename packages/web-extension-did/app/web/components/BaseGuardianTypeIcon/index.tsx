// import CustomSvg, { SvgType } from 'components/CustomSvg';
import { CustomSvgV3, SvgTypeV3 } from 'components/CustomSvgV3';
import clsx from 'clsx';
import './index.less';

interface BaseGuardianTypeIconProps {
  type: SvgTypeV3;
  className?: string;
}

export default function BaseGuardianTypeIcon({ type, className }: BaseGuardianTypeIconProps) {
  return (
    <div className={clsx('base-guardian-type-icon', 'flex-center', className)}>
      <CustomSvgV3 className="flex-center guardian-type-icon" type={type} />
    </div>
  );
}
