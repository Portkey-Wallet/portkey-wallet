import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import clsx from 'clsx';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CustomSvg from 'components/CustomSvg';
import { IconType } from 'types/icon';
import './index.less';

interface VerifierPairProps {
  guardianType?: LoginType;
  verifierSrc?: string;
  verifierName?: string;
  wrapperClassName?: string;
  size?: number;
}

const GuardianTypeIcon: Record<LoginType, IconType> = {
  [LoginType.Email]: 'email',
  [LoginType.Phone]: 'GuardianPhone',
  [LoginType.Google]: 'GuardianGoogle',
  [LoginType.Apple]: 'GuardianApple',
};

export default function VerifierPair({
  guardianType = LoginType.Email,
  size = 32,
  verifierSrc,
  verifierName,
  wrapperClassName,
}: VerifierPairProps) {
  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <CustomSvg type={GuardianTypeIcon[guardianType]} style={{ width: size, height: size, fontSize: size }} />
      <div className="verifier-icon-border">
        <BaseVerifierIcon src={verifierSrc} fallback={verifierName?.[0]} />
      </div>
    </div>
  );
}
