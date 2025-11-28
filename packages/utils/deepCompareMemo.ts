import isEqual from 'lodash/isEqual';
import { memo, FunctionComponent } from 'react';

function defaultEqual(prevProps: any, nextProps: any) {
  return Object.keys(nextProps).some(key => isEqual(prevProps[key], nextProps[key]));
}

export default function deepCompareMemo<P extends object>(
  Component: FunctionComponent<P>,
  propsAreEqual: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
) {
  return memo(Component, propsAreEqual || defaultEqual);
}
