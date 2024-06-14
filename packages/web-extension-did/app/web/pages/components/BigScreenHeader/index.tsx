import { useRef } from 'react';
import CommonHeader from 'components/CommonHeader';
import CopyAddressDrawerOrModal, { ICopyAddressDrawerOrModalInstance } from '../CopyAddressDrawerOrModal';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

export default function BigScreenHeader() {
  const copyAddressDrawerOrModalRef = useRef<ICopyAddressDrawerOrModalInstance | null>(null);
  const navigate = useNavigate();
  const { isNotLessThan768 } = useCommonState();
  return isNotLessThan768 ? (
    <>
      <CommonHeader
        className="portkey-big-screen-header"
        rightElementList={[
          {
            customSvgType: 'RedGiftIcon',
            onClick: () => navigate('/crypto-gifts'),
          },
          {
            customSvgType: 'Copy5',
            onClick: () => copyAddressDrawerOrModalRef.current?.open(),
          },
        ]}
      />
      <CopyAddressDrawerOrModal ref={copyAddressDrawerOrModalRef} />
    </>
  ) : null;
}
