import CommonHeader from 'components/CommonHeader';
import './index.less';
import { SwapForm } from './SwapForm';
import { useNavigateState } from 'hooks/router';
import { useCallback, useMemo, useState } from 'react';
import { SwapSettingButton } from './components/SwapSettingButton';
import { SwapPreview, TSwapPreviewProps } from './SwapPreivew';
import clsx from 'clsx';
import { SwapCompleted } from './SwapCompleted';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { HELP_URL } from '@portkey-wallet/constants/constants-ca/send';

export enum SwapTypeEnum {
  'SwapForm' = 'SwapForm',
  'SwapPreview' = 'SwapPreview',
  'SwapCompleted' = 'SwapCompleted',
}

export const Swap = () => {
  const navigate = useNavigateState();
  const [type, setType] = useState(SwapTypeEnum.SwapForm);
  const [previewProps, setPreviewProps] = useState<TSwapPreviewProps>();
  const onBack = useCallback(() => {
    if (type === SwapTypeEnum.SwapPreview) {
      setType(SwapTypeEnum.SwapForm);
      setPreviewProps(undefined);
      return;
    }
    navigate(-1);
  }, [navigate, type]);

  const title = useMemo(() => (type === SwapTypeEnum.SwapForm ? 'Swap' : 'Preview'), [type]);

  const onFinish = useCallback((props: TSwapPreviewProps) => {
    setPreviewProps(props);
    setType(SwapTypeEnum.SwapPreview);
  }, []);

  const onPreviewFinish = useCallback(() => {
    setType(SwapTypeEnum.SwapCompleted);
  }, []);

  const onHelpClick = useCallback(() => {
    window.open(HELP_URL, '_blank');
  }, []);

  const rightElement = useMemo(() => {
    switch (type) {
      case SwapTypeEnum.SwapForm:
        return <SwapSettingButton key="swapSettingButton" />;
      case SwapTypeEnum.SwapPreview:
        return <CustomSvgV3 type="help" onClick={onHelpClick} />;
      default:
        return null;
    }
  }, [onHelpClick, type]);

  return (
    <div className="swap-page">
      {type !== SwapTypeEnum.SwapCompleted && (
        <div className="swap-common-padding">
          <CommonHeader title={title} onLeftBack={onBack} rightElementList={[rightElement]} />
        </div>
      )}

      <div className="swap-page-body">
        <SwapForm className={clsx(type !== SwapTypeEnum.SwapForm && 'swap-form-hidden')} onFinish={onFinish} />

        {previewProps && type === SwapTypeEnum.SwapPreview && (
          <SwapPreview {...previewProps} onFinish={onPreviewFinish} />
        )}

        {type === SwapTypeEnum.SwapCompleted && <SwapCompleted />}
      </div>
    </div>
  );
};
