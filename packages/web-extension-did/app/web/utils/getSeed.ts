import { createHmac } from 'crypto';
export function getSeed(password: string) {
  if (password) {
    const hmac = createHmac('sha512', password);
    const seed = hmac.update(password).digest('hex');
    return seed;
  }
  //   Toast.fail('Please input password', 3, () => {}, false);
  return false;
}
