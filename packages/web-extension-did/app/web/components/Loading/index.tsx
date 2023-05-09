import { useRef, useEffect } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import animationData from './data.json';

const LoadingIndicator = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!animation.current) {
      animation.current = lottie.loadAnimation({
        container: containerRef.current!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }
    return () => {
      if (animation.current) {
        animation.current.stop();
        animation.current.destroy();
        animation.current = null;
      }
    };
  }, []);

  return <div className="loading" ref={containerRef}></div>;
};

export default LoadingIndicator;
