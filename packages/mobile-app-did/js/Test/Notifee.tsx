import React, { useState } from 'react';
import { Text, View } from 'react-native';
import notifee from '@notifee/react-native';
import { Button } from '@rneui/themed';
import { styles } from './Test.style';

export const SectionNotifee: React.FC = () => {
  const [channelIdTemp, setChannelIdTemp] = useState<string>();
  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      // id: 'default',
      id: 'default',
      name: 'Default Channel',
    });
    setChannelIdTemp(channelId);
    console.log('channelId', channelId);

    // Display a notification
    await notifee.displayNotification({
      id: 'default',
      title: 'Notification Title',
      body: 'Main body content of the notification ' + channelId,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      },
    });
  }

  async function onUpdateNotification() {
    if (!channelIdTemp) {
      console.log();
      return;
    }
    await notifee.displayNotification({
      id: 'default',
      title: 'Updated Notification Title',
      body: 'Updated main body content of the notification ' + channelIdTemp,
      android: {
        channelId: channelIdTemp,
      },
    });
  }

  return (
    <View style={styles.sectionContainer}>
      <View>
        <Text>Notifee</Text>
        <View>
          <Button title="Display Notification" onPress={() => onDisplayNotification()} />
        </View>
        <View>
          <Button title="Update Notification" onPress={() => onUpdateNotification()} />
        </View>
      </View>
    </View>
  );
};
