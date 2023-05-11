import { Col, Row } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { CSSProperties, ReactNode } from 'react';

export interface TitleWrapperProps {
  title?: ReactNode;
  className?: string;
  style?: CSSProperties;
  leftElement?: ReactNode | boolean;
  rightElement?: ReactNode;
  leftCallBack?: (v?: any) => void;
}

export default function TitleWrapper({
  title,
  className,
  style,
  leftElement,
  leftCallBack,
  rightElement,
}: TitleWrapperProps) {
  return (
    <Row justify="space-between" className={clsx(className)} style={style}>
      <Col
        className="title-left-col"
        onClick={() => {
          if (typeof leftElement === 'boolean') return;
          leftCallBack?.();
        }}>
        {leftElement ? (
          leftElement
        ) : typeof leftElement === 'undefined' ? (
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          <CustomSvg style={{ cursor: 'pointer' }} type="LeftArrow" />
        ) : null}
      </Col>
      <Col className="title-center">{title}</Col>
      <Col className="title-right-col">{rightElement || ''}</Col>
    </Row>
  );
}
