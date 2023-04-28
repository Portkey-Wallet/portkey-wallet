import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AboutUsPrompt from './Prompt';
import AboutUsPopup from './Popup';
import { useCommonState } from 'store/Provider/hooks';

export default function AboutUs() {
  const { t } = useTranslation();
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();

  const title = t('About Us');
  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);

  return isNotLessThan768 ? (
    <AboutUsPrompt headerTitle={title} goBack={goBack} />
  ) : (
    <AboutUsPopup headerTitle={title} goBack={goBack} />
  );
}
