import React from 'react';
import useEffectOnce from 'hooks/useEffectOnce';
import { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const useInitSkeleton = (imgPath: any) => {
  const [initSkeleton, setInitSkeleton] = useState<boolean>(true);
  useEffectOnce(() => {
    setTimeout(() => setInitSkeleton(false), 500);
  });

  const showSkeleton = () => {
    return <ImageBackground source={imgPath} style={styles.skeletonContainer} resizeMode="cover" />;
  };
  return {
    initSkeleton,
    showSkeleton,
  };
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default useInitSkeleton;
