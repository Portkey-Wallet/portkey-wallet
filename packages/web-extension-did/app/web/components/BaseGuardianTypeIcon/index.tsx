import CustomSvg, { SvgType } from 'components/CustomSvg';
import clsx from 'clsx';
import './index.less';

interface BaseGuardianTypeIconProps {
  type: SvgType;
  className?: string;
}

export default function BaseGuardianTypeIcon({ type, className }: BaseGuardianTypeIconProps) {
  return (
    <div className={clsx('base-guardian-type-icon', 'flex-center', className)}>
      <CustomSvg className="flex-center guardian-type-icon" type={type} />
    </div>
  );
}
