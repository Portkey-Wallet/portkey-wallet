import { isIOS } from '@rneui/base';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

// Note that only keyboardDidShow and keyboardDidHide events are available on Android
const showEventName = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEventName = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  useEffect(() => {
    const showListener = Keyboard.addListener(showEventName, event => setKeyboardHeight(event.endCoordinates.height));
    const hideListener = Keyboard.addListener(hideEventName, () => setKeyboardHeight(0));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  return keyboardHeight;
}
