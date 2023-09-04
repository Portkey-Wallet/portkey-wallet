import clsx from 'clsx';
import { useState } from 'react';
import { IAvatarProps } from '../type';
import './index.less';
import { ChannelTypeEnum } from '@portkey-wallet/im/types';
import CustomSvg from '../components/CustomSvg';

const Avatar: React.FC<IAvatarProps> = ({
  src,
  letter,
  alt = 'img',
  className,
  channelType,
  height = 40,
  width = 40,
}) => {
  const [isError, setIsError] = useState(false);
  return channelType === ChannelTypeEnum.GROUP ? (
    <div className="flex-center portkey-avatar-group-container">
      <CustomSvg type="GroupAvatar" className="group-avatar-icon" />
    </div>
  ) : (
    <div className={clsx('portkey-avatar-container', className)} style={{ width, height }}>
      {letter ? (
        <div className="avatar-letter flex-center">{letter}</div>
      ) : src && !isError ? (
        <img
          alt={alt}
          src={src}
          className="avatar-img"
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
        />
      ) : (
        <div className="avatar-letter flex-center">A</div>
      )}
    </div>
  );
};
export default Avatar;
