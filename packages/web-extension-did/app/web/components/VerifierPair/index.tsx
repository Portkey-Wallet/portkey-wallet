import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import clsx from 'clsx';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CustomSvg from 'components/CustomSvg';
import { IconType } from 'types/icon';
import { zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import { useMemo } from 'react';
import './index.less';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';

interface VerifierPairProps {
  guardianType?: LoginType;
  verifierSrc?: string;
  verifierName?: string;
  wrapperClassName?: string;
  size?: number;
  guardian?: UserGuardianItem;
}

export const GuardianTypeIcon: Record<LoginType, IconType> = {
  [LoginType.Email]: 'Email',
  [LoginType.Phone]: 'Phone',
  [LoginType.Google]: 'Google',
  [LoginType.Apple]: 'Apple',
  [LoginType.Telegram]: 'Telegram',
  [LoginType.Facebook]: 'Facebook',
  [LoginType.Twitter]: 'Twitter',
};

export default function VerifierPair({
  guardianType = LoginType.Email,
  size = 42,
  verifierSrc,
  verifierName,
  wrapperClassName,
  guardian,
}: VerifierPairProps) {
  const isZK = useMemo(
    () => guardian?.verifiedByZk || guardian?.manuallySupportForZk,
    [guardian?.manuallySupportForZk, guardian?.verifiedByZk],
  );

  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <div className="verifier-icon-border">
        <BaseVerifierIcon src={verifierSrc} fallback={isZK ? zkLoginVerifierItem.name : verifierName?.[0]} />
      </div>
      <div className="guardian-icon flex-center" style={{ width: size, height: size, fontSize: size }}>
        <CustomSvg className="flex" type={GuardianTypeIcon[guardianType]} />
      </div>
    </div>
  );
}
