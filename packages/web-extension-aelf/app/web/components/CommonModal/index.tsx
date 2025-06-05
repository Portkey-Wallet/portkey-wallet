/* eslint-disable no-inline-styles/no-inline-styles */
import { Col, Modal, ModalProps, Row } from 'antd';
import clsx from 'clsx';
import { LeftOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import './styles.less';

export interface CommonModalProps extends ModalProps {
  className?: string;
  leftCallBack?: () => void;
  leftElement?: ReactNode;
  transitionName?: string;
}

export default function CommonModal(props: CommonModalProps) {
  const { leftCallBack, width, title, leftElement, transitionName } = props;
  return (
    <Modal
      maskClosable={false}
      centered={props.centered ?? true}
      destroyOnClose
      footer={null}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      {...props}
      width={width ? width : '400px'}
      className={clsx('common-modals', props.className)}
      transitionName={transitionName}
      title={
        <Row justify="space-between">
          {leftCallBack || leftElement ? (
            <Col className="common-modal-left-icon" flex={1} onClick={leftCallBack}>
              {leftElement || <LeftOutlined />}
            </Col>
          ) : null}
          <Col flex={2} style={{ textAlign: 'center' }}>
            {title}
          </Col>
          {leftCallBack || leftElement ? <Col flex={1} /> : null}
        </Row>
      }
    />
  );
}
