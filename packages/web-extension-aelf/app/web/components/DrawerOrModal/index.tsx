import { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import CommonCloseHeader from 'components/CommonCloseHeader';
import BaseDrawer from '../BaseDrawer';
import { useCommonState } from 'store/Provider/hooks';
import BaseModal from 'components/BaseModal';
import './index.less';

export interface IDrawerOrModalInstance {
  open: () => void;
}

interface IDrawerOrModal {
  content: React.ReactNode;
  title: string;
  className: string;
  height?: number;
}

export const DrawerOrModal = forwardRef(({ content, title, className, height }: IDrawerOrModal, ref) => {
  const { isNotLessThan768 } = useCommonState();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const commonProps = useMemo(
    () => ({
      destroyOnClose: true,
      open: isOpen,
      onClose: handleClose,
    }),
    [isOpen, handleClose],
  );

  return isNotLessThan768 ? (
    <BaseModal
      {...commonProps}
      footer={false}
      centered
      // closable={false}
      className={'common-drawer-or-modal-modal ' + className}
      maskClosable>
      <CommonCloseHeader title={title} onClose={handleClose} />
      {content}
    </BaseModal>
  ) : (
    <BaseDrawer
      {...commonProps}
      className={'common-drawer common-drawer-or-modal-drawer ' + className}
      height={height || 'auto'}
      maskClosable
      placement="bottom">
      <CommonCloseHeader title={title} onClose={handleClose} />
      {content}
    </BaseDrawer>
  );
});
