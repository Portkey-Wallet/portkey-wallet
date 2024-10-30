import { Linking } from 'react-native';

export async function openOutLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log('open error');
  }
}
