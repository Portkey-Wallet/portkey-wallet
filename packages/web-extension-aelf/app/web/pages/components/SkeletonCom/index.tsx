import { Skeleton, SkeletonProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export enum SkeletonAvatarShapeEnum {
  square = 'square',
  circle = 'circle',
}

export enum SkeletonComType {
  avatar = 'avatar',
  image = 'image',
}

interface ISkeletonComProps extends SkeletonProps {
  type?: SkeletonComType;
}

export default function SkeletonCom({ type = SkeletonComType.avatar, ...restProps }: ISkeletonComProps) {
  const commonProps = {
    active: true,
    ...restProps,
  };

  if (type === 'image') {
    return (
      <Skeleton.Node {...commonProps}>
        <CustomSvg className="skeleton-image-icon" type="AlbumFilled" />
      </Skeleton.Node>
    );
  }

  return <Skeleton.Avatar shape={SkeletonAvatarShapeEnum.square} {...commonProps} />;
}
