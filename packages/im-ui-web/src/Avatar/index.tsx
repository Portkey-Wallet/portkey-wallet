import clsx from 'clsx';
import { IAvatarProps } from '../type';
import './index.less';

const Avatar: React.FC<IAvatarProps> = ({ src, letterItem, alt = 'img', className }) => {
  return (
    // @ts-ignore
    <div className={clsx('portkey-avatar-container flex-center', className)}>
      {letterItem ? (
        <div className="avatar-letter flex-center">{letterItem}</div>
      ) : (
        <img alt={alt} src={src} className="avatar-img" />
      )}
    </div>
  );
};
export default Avatar;
