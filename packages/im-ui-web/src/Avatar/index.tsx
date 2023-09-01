import clsx from 'clsx';
import { useState } from 'react';
import { IAvatarProps } from '../type';
import './index.less';

const Avatar: React.FC<IAvatarProps> = ({ src, letter, alt = 'img', className, height = 40, width = 40 }) => {
  const [isError, setIsError] = useState(false);
  return (
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
