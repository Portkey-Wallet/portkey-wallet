import clsx from 'clsx';
import { useState } from 'react';
import { IAvatarProps } from '../type';
import './index.less';
import { ChannelTypeEnum } from '@portkey-wallet/im/types';
import CustomSvg from '../components/CustomSvg';

const Avatar: React.FC<IAvatarProps> = ({
  src,
  showLetter = false,
  letter,
  alt = 'img',
  className,
  channelType,
  height = 40,
  width = 40,
  groupAvatarSize = 'default',
  onClick,
}) => {
  const [isError, setIsError] = useState(false);
  return channelType === ChannelTypeEnum.GROUP ? (
    <div className={clsx('portkey-avatar-group-container', groupAvatarSize)} onClick={onClick}>
      {src && !isError ? (
        <div className="portkey-avatar-group-img">
          <img
            alt={alt}
            src={src}
            className="avatar-img"
            onError={() => setIsError(true)}
            onLoad={() => setIsError(false)}
          />
        </div>
      ) : (
        <div className="flex-center portkey-avatar-group-default">
          <CustomSvg type="GroupAvatar" className="group-avatar-icon" />
        </div>
      )}
      <CustomSvg type="GroupAvatar" className="flex-center portkey-avatar-group-badge" />
    </div>
  ) : (
    <div className={clsx('portkey-avatar-container', className)} style={{ width, height }} onClick={onClick}>
      {showLetter ? (
        <div className="avatar-letter flex-center">{letter || 'A'}</div>
      ) : src && !isError ? (
        <img
          alt={alt}
          src={src}
          className="avatar-img"
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
        />
      ) : (
        <div className="avatar-letter flex-center">{letter || 'A'}</div>
      )}
    </div>
  );
};
export default Avatar;
