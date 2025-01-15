import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AboutUsPopup from './Popup';

export default function AboutUs() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t('About Portkey');
  const goBack = useCallback(() => navigate('/setting'), [navigate]);

  return <AboutUsPopup headerTitle={title} goBack={goBack} />;
}
