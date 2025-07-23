import { useMemo } from 'react';
import CommonCloseHeader from 'components/CommonCloseHeader';
import BaseDrawer from '../BaseDrawer';
import { useCommonState } from 'store/Provider/hooks';
import BaseModal from 'components/BaseModal';
import './index.less';

interface IDrawerOrModal {
  content: React.ReactNode;
  title: string | React.ReactNode;
  className: string;
  height?: number;
  open?: boolean;
  onClose: () => void;
}

export const DrawerOrModal = ({ content, title, className, height, open = false, onClose }: IDrawerOrModal) => {
  const { isNotLessThan768 } = useCommonState();

  console.log('DrawerOrModal v2 open', open);

  const commonProps = useMemo(
    () => ({
      destroyOnClose: true,
      open: open,
      onClose: onClose,
    }),
    [open, onClose],
  );

  return isNotLessThan768 ? (
    <BaseModal
      {...commonProps}
      footer={false}
      centered
      // closable={false}
      className={'common-drawer-or-modal-modal ' + className}
      maskClosable>
      <CommonCloseHeader title={title} onClose={onClose} />
      {content}
    </BaseModal>
  ) : (
    <BaseDrawer
      {...commonProps}
      className={'common-drawer common-drawer-or-modal-drawer ' + className}
      height={height || 'auto'}
      maskClosable
      placement="bottom">
      <CommonCloseHeader title={title} onClose={onClose} />
      {content}
    </BaseDrawer>
  );
};
