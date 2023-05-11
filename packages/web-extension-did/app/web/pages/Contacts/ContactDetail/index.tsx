import { useCommonState } from 'store/Provider/hooks';
import { useParams } from 'react-router';
import EditContact from '../EditContact';
import ViewContact from '../ViewContact';
import './index.less';

export default function Contact() {
  const { type } = useParams();
  const { isNotLessThan768 } = useCommonState();

  return (
    <div className={isNotLessThan768 ? 'contact-detail-prompt' : 'min-width-max-height'}>
      {type === 'view' && <ViewContact />}
      {(type === 'edit' || type === 'add') && <EditContact />}
    </div>
  );
}
