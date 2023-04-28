import React, { useCallback, useEffect, useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import * as Battery from 'expo-battery';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { styles } from './Test.style';
import { Subscription } from 'expo-modules-core';
import Constants from 'expo-constants';
import { Button } from '@rneui/themed';

console.log('Constants', Constants);

let batterSubscription: Subscription | null;
export const SectionTest: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [currentBatteryLevel, setCurrentBatteryLevel] = useState<number | null>(null);

  const _subscribe = useCallback(async () => {
    console.log('batterSubscription before', batterSubscription, !!batterSubscription);
    if (batterSubscription) {
      return;
    }
    console.log('Battery', Battery);
    try {
      const batteryLevelTemp = await Battery.getBatteryLevelAsync();
      console.log('batteryLevel', batteryLevelTemp);
      setCurrentBatteryLevel(batteryLevelTemp);
      batterSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setCurrentBatteryLevel(batteryLevel);
        console.log('batteryLevel changed!', batteryLevel);
      });
      console.log('batterSubscription after', batterSubscription, !!batterSubscription);
    } catch (e) {
      console.log('Battery Error', e);
    }
  }, []);
  // const _subscribe = useCallback(() => {}, [])

  const _unsubscribe = useCallback(() => {
    batterSubscription && batterSubscription.remove();
  }, []);

  useEffect(() => {
    _subscribe();
    return () => {
      _unsubscribe();
    };
  }, [_unsubscribe, _subscribe]);

  return (
    <View style={styles.sectionContainer}>
      <View>
        {/*<Button*/}
        {/*  onPress={() => {*/}
        {/*    console.log(1);*/}
        {/*  }}*/}
        {/*  title="Learn More"*/}
        {/*  color="#841584"*/}
        {/*  accessibilityLabel="Learn more about this purple button"*/}
        {/*/>*/}
        {/*<Button title="Solid Button" />*/}
        <Button
          title={'React Native Elements'}
          onPress={() => {
            console.log('onPress', 1);
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
        />
        <Text>Button</Text>
      </View>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        batteryLevel {currentBatteryLevel} Level 12
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        Test text
      </Text>
    </View>
  );
};
