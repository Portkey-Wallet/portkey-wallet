import clsx from 'clsx';
import { IAvatarProps } from '../type';
import './index.less';
import { ChannelTypeEnum } from '@portkey-wallet/im/types';

const Avatar: React.FC<IAvatarProps> = ({ src, letterItem, alt = 'img', className, channelType }) => {
  return (
    <div className={clsx('portkey-avatar-container flex-center', className)}>
      {channelType === ChannelTypeEnum.GROUP && <img alt={alt} src={src} className="avatar-img" />}
      {channelType === ChannelTypeEnum.P2P &&
        (letterItem ? (
          <div className="avatar-letter flex-center">{letterItem}</div>
        ) : src ? (
          <img alt={alt} src={src} className="avatar-img" />
        ) : (
          <div className="avatar-letter flex-center">A</div>
        ))}
    </div>
  );
};
export default Avatar;
