import 'react-native-get-random-values';
import { decode, encode } from 'base-64';
import { Buffer } from 'buffer';
import './shim';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

if (!global.Buffer) {
  global.Buffer = Buffer;
}
