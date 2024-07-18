import { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Modal, Button, Image } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { ActivityModalConfig, TimingType } from '@portkey-wallet/types/types-ca/cms';
import { usePortkeyCommonLink } from 'hooks/usePortkeyLink';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { setActivityModalCurrentTimeShowed, setActivityModalShowed } from '@portkey-wallet/store/store-ca/cms/actions';
export type CustomModalType = {
  showModal: () => void;
  closeModal: () => void;
  updateDataList: (dataList: ActivityModalConfig[]) => void;
};
const CustomActivityModal = forwardRef(({ open }: { open?: boolean }, ref) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(open || false);
  // const [currentData, setCurrentData] = useState<ActivityModalConfig>();
  // const [dataList, setDataList] = useState<ActivityModalConfig[]>();
  const navigatePortkeyLink = usePortkeyCommonLink();
  const indexRef = useRef(0);
  const currentDataRef = useRef<ActivityModalConfig>();
  const dataListRef = useRef<ActivityModalConfig[]>();
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const showModal = () => {
    setIsOpen(() => {
      if (dataListRef.current) {
        currentDataRef.current = dataListRef.current[indexRef.current];
      }
      return true;
    });
  };
  console.log(
    'wfs currentDataRef.current',
    currentDataRef.current,
    'isOpen',
    isOpen,
    'dataListRef.current',
    dataListRef.current,
  );
  const updateDataList = (dataList: ActivityModalConfig[]) => {
    // setDataList(dataList);
    dataListRef.current = dataList;
    indexRef.current = 0;
    showModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log('currentData closeModal', currentDataRef.current);
    if (currentDataRef.current) {
      dispatch(
        setActivityModalCurrentTimeShowed({
          network: networkType,
          id: currentDataRef.current?.id,
        }),
      );
    }
    if (currentDataRef.current && currentDataRef.current.timingType !== TimingType.AppOpen) {
      dispatch(
        setActivityModalShowed({
          network: networkType,
          id: currentDataRef.current?.id,
        }),
      );
    }
    indexRef.current = indexRef.current + 1;
    if (dataListRef.current && dataListRef.current.length > indexRef.current) {
      console.log('nextData closeModal', dataListRef.current[indexRef.current]);
      // setCurrentData(dataList[indexRef.current]);
      setTimeout(() => {
        showModal();
      }, 100);
    }
  };

  const clickOk = () => {
    if (currentDataRef.current && currentDataRef.current.positiveAction) {
      navigatePortkeyLink(currentDataRef.current.positiveAction);
    }
    closeModal();
  };
  const clickCancel = () => {
    closeModal();
  };

  useImperativeHandle(ref, () => ({
    showModal,
    closeModal,
    updateDataList,
  }));
  if (!currentDataRef.current) {
    return null;
  }
  return (
    <>
      <Modal
        className="portkey-custom-modal"
        closable={false}
        open={isOpen}
        bodyStyle={{ padding: 0 }}
        footer={
          <div>
            <Button key="submit" type="primary" onClick={() => clickOk()}>
              {t(currentDataRef.current.positiveTitle)}
            </Button>
            <Button key="extra" onClick={() => clickCancel()}>
              {t(currentDataRef.current.negtiveTitle)}
            </Button>
          </div>
        }>
        <div className="join-official-group-tip-modal-container">
          {currentDataRef.current.showClose && (
            <CustomSvg
              type="CloseNew"
              onClick={() => {
                console.log('clicked CloseNew icon!');
                closeModal();
              }}
            />
          )}
          {currentDataRef.current.headerImg && (
            <div className="flex-center join-official-group-icon">
              <Image width="100%" height="100%" src={currentDataRef.current.headerImg} preview={false} />
            </div>
          )}
          <div className="modal-title">{t(currentDataRef.current.title)}</div>
          <div className="modal-content flex-column">{t(currentDataRef.current.description)}</div>
        </div>
      </Modal>
    </>
  );
});

export default CustomActivityModal;
