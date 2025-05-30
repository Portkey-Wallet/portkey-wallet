import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AutoLockData, AutoLockDataKey, DefaultLock } from 'constants/lock';
import { useStorage } from 'hooks/useStorage';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import storage from 'utils/storage/storage';
import { BaseHeaderProps } from 'types/UI';
import AutoLockPrompt from './Prompt';
import AutoLockPopup from './Popup';
import { useCommonState } from 'store/Provider/hooks';

export interface IAutoLockProps extends BaseHeaderProps {
  className?: string;
  label: string;
  list: {
    value: string;
    children: string;
  }[];
  defaultValue: string;
  value?: AutoLockDataKey;
  onChange: (value: string) => void;
}

export default function AutoLock({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigate();
  const lockValue = useStorage<AutoLockDataKey>('lockTime');

  const AutoLockList = useMemo(
    () =>
      Object.entries(AutoLockData).map(([key, label]) => ({
        value: key,
        children: t(label),
      })),
    [t],
  );

  const onLockChange = useCallback((value: string) => {
    value in AutoLockData &&
      setLocalStorage({
        [storage.lockTime]: value,
      });
  }, []);

  const title = t('Auto-Lock');
  const goBack = useCallback(() => navigate('/setting/wallet'), [navigate]);

  return isNotLessThan768 ? (
    <AutoLockPrompt
      className={className}
      headerTitle={title}
      label={title}
      list={AutoLockList}
      defaultValue={DefaultLock}
      value={lockValue}
      goBack={goBack}
      onChange={onLockChange}
    />
  ) : (
    <AutoLockPopup
      className={className}
      headerTitle={title}
      label={title}
      list={AutoLockList}
      defaultValue={DefaultLock}
      value={lockValue}
      goBack={goBack}
      onChange={onLockChange}
    />
  );
}
