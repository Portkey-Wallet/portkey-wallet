import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import clsx from 'clsx';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import CustomSvg from 'components/CustomSvg';
import { IconType } from 'types/icon';
import { zkloginGuardianType } from 'constants/guardians';
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
  size = 32,
  verifierSrc,
  verifierName,
  wrapperClassName,
  guardian,
}: VerifierPairProps) {
  const isZK = useMemo(
    () => guardian?.verifiedByZk || guardian?.manuallySupportForZk,
    [guardian?.manuallySupportForZk, guardian?.verifiedByZk],
  );
  const isShowZkLoginTag = useMemo(() => {
    return zkloginGuardianType.includes(LoginType[guardianType] as any) && !isZK;
  }, [guardianType, isZK]);

  return (
    <div className={clsx('flex-row-center icon-pair', wrapperClassName)}>
      <div className="guardian-icon flex-center" style={{ width: size, height: size, fontSize: size }}>
        <CustomSvg className="flex" type={GuardianTypeIcon[guardianType]} />
      </div>
      <div className="verifier-icon-border">
        <BaseVerifierIcon src={verifierSrc} fallback={verifierName?.[0]} />
      </div>
      {isShowZkLoginTag && <div className="zklogin-icon">{`zkLogin`}</div>}
    </div>
  );
}
