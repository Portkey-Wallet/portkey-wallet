import { Progress } from 'antd';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const MAX_PROGRESS_BEFORE_COMPLETE = 0.95;
const PROGRESS_STEP = 0.05;

export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWalletProgress = forwardRef(function _PrepareWalletProgress(_, ref) {
  const [percent, setPercent] = useState(0);
  const percentRef = useRef(percent);
  percentRef.current = percent;

  useEffect(() => {
    const timer = setInterval(() => {
      if (percentRef.current >= MAX_PROGRESS_BEFORE_COMPLETE) {
        return;
      }
      setPercent((pre) => pre + PROGRESS_STEP);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const complete = useCallback(() => {
    setPercent(1);
  }, []);

  useImperativeHandle(
    ref,
    (): PrepareWalletProgressInterface => {
      return {
        complete,
      };
    },
    [complete],
  );

  return (
    <div className="prepare-wallet-progress">
      <h2>{'Preparing your wallet...'}</h2>
      <Progress percent={percent * 100} />
    </div>
  );
});
