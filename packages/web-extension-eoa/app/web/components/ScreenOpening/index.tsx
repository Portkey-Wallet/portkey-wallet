import lottie, { AnimationEventCallback } from 'lottie-web';
import { useCallback, useEffect } from 'react';

export default function ScreenOpening({
  className,
  onFinish,
}: {
  className?: string;
  onFinish?: AnimationEventCallback;
}) {
  const listener: AnimationEventCallback = useCallback(
    (arg) => {
      onFinish?.(arg);
    },
    [onFinish],
  );
  useEffect(() => {
    const animation = lottie.loadAnimation({
      path: '',
      // path: './assets/animation/ScreenOpening/data.json',
      loop: false,
      autoplay: true,
      renderer: 'svg',
      container: document.getElementById('screen-opening') as HTMLElement,
    });
    animation.addEventListener('complete', listener);
    animation.addEventListener('error', listener);
    return () => {
      animation.removeEventListener('complete', listener);
      animation.removeEventListener('error', listener);
    };
  }, [listener]);

  return <div id="screen-opening" className={className}></div>;
}
