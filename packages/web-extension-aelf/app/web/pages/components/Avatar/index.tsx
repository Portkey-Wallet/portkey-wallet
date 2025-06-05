import clsx from 'clsx';
import ImageDisplay from '../ImageDisplay';
import { CSSProperties, useCallback, useState } from 'react';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';
import CircleLoading, { LoadingType } from '../../../components/CircleLoading';

export interface IAvatarProps {
  wrapperClass?: string;
  wrapperStyle?: CSSProperties;
  avatarUrl?: string;
  nameIndex?: string;
  size?: 'xl' | 'large' | 'small' | 'default';
  onClick?: () => void;
  loading?: {
    loading: boolean;
    type: LoadingType;
  };
}

export default function Avatar({
  wrapperClass,
  wrapperStyle,
  avatarUrl,
  nameIndex,
  size = 'default',
  onClick,
  loading,
}: RequireAtLeastOne<IAvatarProps, 'avatarUrl' | 'nameIndex'>) {
  const [avatarClass, setAvatarClass] = useState<'avatar-xl' | 'avatar-large' | 'avatar-default' | 'avatar-small'>(
    'avatar-default',
  );

  const [avatarDefaultHeight, setAvatarDefaultHeight] = useState<80 | 40 | 32 | 24>(32);

  const sizeRule = useCallback(() => {
    switch (size) {
      case 'xl':
        setAvatarClass('avatar-xl');
        setAvatarDefaultHeight(80);
        break;

      case 'large':
        setAvatarClass('avatar-large');
        setAvatarDefaultHeight(40);
        break;

      case 'default':
        setAvatarClass('avatar-default');
        setAvatarDefaultHeight(32);
        break;

      case 'small':
        setAvatarClass('avatar-small');
        setAvatarDefaultHeight(24);
        break;

      default:
        break;
    }
  }, [size]);

  useEffectOnce(() => {
    sizeRule();
  });

  return (
    <div className={clsx(['flex-center', 'avatar', avatarClass, wrapperClass])} style={wrapperStyle} onClick={onClick}>
      {avatarUrl ? (
        <ImageDisplay src={avatarUrl} defaultHeight={avatarDefaultHeight} className="avatar-img" />
      ) : (
        <div className="flex-center name-index" style={wrapperStyle}>
          {nameIndex}
        </div>
      )}
      {loading && loading.loading && (
        <div
          className="avatar-loading-container"
          style={{
            height: avatarDefaultHeight + 2,
            width: avatarDefaultHeight + 2,
          }}>
          <CircleLoading height={loading.type.height} width={loading.type.width} />
        </div>
      )}
    </div>
  );
}
