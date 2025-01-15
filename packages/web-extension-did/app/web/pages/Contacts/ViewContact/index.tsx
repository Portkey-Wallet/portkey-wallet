import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useCallback } from 'react';
import { useCommonState } from 'store/Provider/hooks';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const { state } = useLocation(); // TViewContactLocationState
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    switch (state?.previousPage) {
      case 'new-chat':
        navigate('/new-chat', { state });
        break;

      case 'contact-list':
        navigate('/setting/contacts');
        break;

      default:
        navigate(-1);
        break;
    }
  }, [navigate, state]);

  return isNotLessThan768 ? (
    <ViewContactPrompt headerTitle="Address Detail" data={state} goBack={goBack} />
  ) : (
    <ViewContactPopup headerTitle="Address Detail" data={state} goBack={goBack} />
  );
}
