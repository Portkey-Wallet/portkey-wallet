import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { IAvatarProps } from '../type';
import CustomSvg, { SvgType } from '../components/CustomSvg';
import './index.less';

const Avatar: React.FC<IAvatarProps> = ({
  src,
  svgSrc,
  isGroupAvatar = false,
  letter = '',
  alt = 'img',
  className,
  avatarSize = 'default',
  onClick,
}) => {
  const [isError, setIsError] = useState(false);

  const renderGroupAvatar = useMemo(
    () => (
      <>
        {(src || svgSrc) && !isError ? (
          svgSrc ? (
            <div className="avatar-group-svg">
              <CustomSvg type={svgSrc as SvgType} />
            </div>
          ) : (
            <img
              alt={alt}
              src={src}
              className="avatar-group-img"
              onError={() => setIsError(true)}
              onLoad={() => setIsError(false)}
            />
          )
        ) : (
          <div className="flex-center avatar-group-default">
            <CustomSvg type="GroupAvatar" className="group-avatar-icon" />
          </div>
        )}
        <CustomSvg type="GroupAvatar" className="flex-center avatar-group-badge" />
      </>
    ),
    [alt, isError, src, svgSrc],
  );
  const renderAvatar = useMemo(
    () => (
      <>
        {(src || svgSrc) && !isError ? (
          svgSrc ? (
            <div className="avatar-svg">
              <CustomSvg type={svgSrc as SvgType} />
            </div>
          ) : (
            <img
              alt={alt}
              src={src}
              className="avatar-img"
              onError={() => setIsError(true)}
              onLoad={() => setIsError(false)}
            />
          )
        ) : (
          <div className="avatar-letter flex-center">{letter?.substring(0, 1).toUpperCase() || 'A'}</div>
        )}
      </>
    ),
    [alt, isError, letter, src, svgSrc],
  );

  return (
    <div className={clsx('portkey-avatar-container', className, `portkey-avatar-${avatarSize}`)} onClick={onClick}>
      {isGroupAvatar ? renderGroupAvatar : renderAvatar}
    </div>
  );
};
export default Avatar;
