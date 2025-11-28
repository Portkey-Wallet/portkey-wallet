import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

export default class AESUtils {
  static encrypt(input: string, password: string) {
    const ciphertext = AES.encrypt(input, password);
    // no encUtf8 here.
    return ciphertext.toString();
  }

  static decrypt(input: string, password: string) {
    const bytes = AES.decrypt(input, password);
    return bytes.toString(encUtf8);
  }
}
