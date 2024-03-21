import crashlytics from '@react-native-firebase/crashlytics';
import React, { useEffect } from 'react';
import CommonButton from 'components/CommonButton';
import { Text } from 'react-native';

async function onSignIn(user: any) {
  crashlytics().log('User signed in.');

  await Promise.all([
    crashlytics().setUserId(user.uid),
    crashlytics().setAttribute('credits', String(user.credits)),
    crashlytics().setAttributes({
      role: 'admin',
      followers: '13',
      email: user.email,
      username: user.username,
    }),
  ]);
}

export const CrashTest = () => {
  useEffect(() => {
    crashlytics().log('App mounted.');
  }, []);

  return (
    <Text>
      <CommonButton
        title="Sign In"
        onPress={() =>
          onSignIn({
            uid: 'Aa0Bb1Cc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9',
            username: 'Joaquin Phoenix',
            email: 'phoenix@example.com',
            credits: 42,
          })
        }
      />
      <CommonButton title="crash!" onPress={() => crashlytics().crash()} />
    </Text>
  );
};
