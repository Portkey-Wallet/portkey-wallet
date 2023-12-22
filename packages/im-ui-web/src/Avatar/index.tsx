import clsx from 'clsx';
import { useMemo, useState } from 'react';
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
  avatarSize = 'default',
  onClick,
}) => {
  const [isError, setIsError] = useState(false);

  const renderGroupAvatar = useMemo(
    () => (
      <>
        {src && !isError ? (
          <img
            alt={alt}
            src={src}
            className="avatar-group-img"
            onError={() => setIsError(true)}
            onLoad={() => setIsError(false)}
          />
        ) : (
          <div className="flex-center avatar-group-default">
            <CustomSvg type="GroupAvatar" className="group-avatar-icon" />
          </div>
        )}
        <CustomSvg type="GroupAvatar" className="flex-center avatar-group-badge" />
      </>
    ),
    [alt, isError, src],
  );
  const renderAvatar = useMemo(
    () => (
      <>
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
      </>
    ),
    [alt, isError, letter, showLetter, src],
  );

  return (
    <div className={clsx('portkey-avatar-container', className, `portkey-avatar-${avatarSize}`)} onClick={onClick}>
      {channelType === ChannelTypeEnum.GROUP ? renderGroupAvatar : renderAvatar}
    </div>
  );
};
export default Avatar;
