import clsx from 'clsx';
import ImageDisplay from '../ImageDisplay';
import { CSSProperties, useState } from 'react';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';

export interface IAvatarProps {
  wrapperClass?: string;
  wrapperStyle?: CSSProperties;
  avatarUrl?: string;
  nameIndex?: string;
  size?: 'large' | 'small' | 'default';
  onClick?: () => void;
}

export default function Avatar({
  wrapperClass,
  wrapperStyle,
  avatarUrl,
  nameIndex,
  size = 'default',
  onClick,
}: RequireAtLeastOne<IAvatarProps, 'avatarUrl' | 'nameIndex'>) {
  const [avatarClass, setAvatarClass] = useState<'avatar-large' | 'avatar-default' | 'avatar-small'>('avatar-default');

  const [avatarDefaultHeight, setAvatarDefaultHeight] = useState<60 | 40 | 28>(40);

  const sizeRule = () => {
    switch (size) {
      case 'large':
        setAvatarClass('avatar-large');
        setAvatarDefaultHeight(60);
        break;

      case 'default':
        setAvatarClass('avatar-default');
        setAvatarDefaultHeight(40);
        break;

      case 'small':
        setAvatarClass('avatar-small');
        setAvatarDefaultHeight(28);
        break;

      default:
        break;
    }
    return size;
  };

  useEffectOnce(() => {
    sizeRule();
  });

  return (
    <div className={clsx(['flex-center', 'avatar', avatarClass, wrapperClass])} style={wrapperStyle} onClick={onClick}>
      {avatarUrl ? (
        <ImageDisplay src={avatarUrl} defaultHeight={avatarDefaultHeight} />
      ) : (
        <div className="flex-center name-index" style={wrapperStyle}>
          {nameIndex}
        </div>
      )}
    </div>
  );
}
