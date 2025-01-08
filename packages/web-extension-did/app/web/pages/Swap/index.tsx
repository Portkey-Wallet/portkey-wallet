import CommonHeader from 'components/CommonHeader';
import './index.less';
import { SwapForm } from './SwapForm';
import { useNavigateState } from 'hooks/router';
import { useCallback, useMemo, useState } from 'react';
import { SwapSettingButton } from './components/SwapSettingButton';

export enum SwapTypeEnum {
  'SwapForm' = 'SwapForm',
  'SwapPreview' = 'SwapPreview',
}

export const Swap = () => {
  const navigate = useNavigateState();
  const [type, setType] = useState(SwapTypeEnum.SwapForm);
  const onBack = useCallback(() => {
    if (type === SwapTypeEnum.SwapPreview) {
      return setType(SwapTypeEnum.SwapForm);
    }
    navigate(-1);
  }, [navigate, type]);

  const title = useMemo(() => (type === SwapTypeEnum.SwapForm ? 'Swap' : 'Preview'), [type]);

  return (
    <div className="swap-page">
      <CommonHeader
        title={title}
        onLeftBack={onBack}
        rightElementList={[<SwapSettingButton key="swapSettingButton" />]}
      />
      <div className="swap-page-body">
        <SwapForm />
      </div>
    </div>
  );
};
