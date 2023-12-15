import { GestureResponderEvent } from 'react-native';

type MeasureLocation = { x: number; y: number; width: number; height: number; pageX: number; pageY: number };

export async function measureLocation(target: GestureResponderEvent['target']): Promise<MeasureLocation> {
  return new Promise(resolve => {
    target.measure((x, y, width, height, pageX, pageY) => resolve({ x, y, width, height, pageX, pageY }));
  });
}

export async function measurePageY(target: GestureResponderEvent['target']) {
  try {
    const { pageY } = await measureLocation(target);
    return pageY || 0;
  } catch (error) {
    return 0;
  }
}
