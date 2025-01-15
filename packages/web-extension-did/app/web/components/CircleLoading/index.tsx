import { useRef, useEffect } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import animationDarkData from './spinnerDark';
import animationWhiteData from './spinnerWhite';

export type LoadingType = {
  width?: number;
  height?: number;
};

// TODO-SA
const theme = 'dark';

const CircleLoading = (props: LoadingType) => {
  const { width = 16, height = 16 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!animation.current) {
      animation.current = lottie.loadAnimation({
        container: containerRef.current!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: theme === 'dark' ? animationWhiteData : animationDarkData,
      });
    }
    return () => {
      animation.current?.stop();
      animation.current?.destroy();
      animation.current = null;
    };
  }, []);

  return <div className="circle-loading" style={{ width, height }} ref={containerRef}></div>;
};

export default CircleLoading;
