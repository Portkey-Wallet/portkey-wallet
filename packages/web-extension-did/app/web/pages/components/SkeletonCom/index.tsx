import { Skeleton, SkeletonProps } from 'antd';
import './index.less';

export enum SkeletonShapeEnum {
  square = 'square',
  circle = 'circle',
}

export default function SkeletonCom(props: SkeletonProps) {
  const _props = {
    shape: SkeletonShapeEnum.square,
    active: true,
    ...props,
  };

  return <Skeleton.Avatar {..._props} />;
}
