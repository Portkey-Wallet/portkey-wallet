import { useCommonState } from 'store/Provider/hooks';
import { useParams } from 'react-router';
import EditContact from '../EditContact';
import ViewContact from '../ViewContact';
import './index.less';
import AddContact from '../AddContact';

export default function ContactDetail() {
  const { type, extra } = useParams();
  const { isNotLessThan768 } = useCommonState();

  return (
    <div className={isNotLessThan768 ? 'contact-detail-prompt' : 'min-width-max-height'}>
      {type === 'view' && <ViewContact />}
      {/* can chat edit */}
      {type === 'edit' && extra === '1' && <EditContact />}
      {/* cant chat edit */}
      {type === 'edit' && extra === '2' && <AddContact />}
      {/* add new contact */}
      {type === 'add' && <AddContact />}
    </div>
  );
}
