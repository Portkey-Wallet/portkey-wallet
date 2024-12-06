import axios from 'axios';
import { Canceler } from 'axios';
import { writeAsStringAsync } from 'expo-file-system';

type CacheUtilProps = {
  imagePath: string;
  imageUri: string;
};

export default class CacheImageUtils {
  protected imagePath: string;
  protected imageUri: string;
  protected canceler?: Canceler | null;
  constructor(props: CacheUtilProps) {
    this.imagePath = props.imagePath;
    this.imageUri = props.imageUri;
  }
  fetchImage = async () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const response = await axios.get(this.imageUri, {
      responseType: 'arraybuffer',
      cancelToken: new axios.CancelToken(canceler => {
        that.canceler = canceler;
      }),
    });
    const base64 = Buffer.from(response.data).toString('base64');
    await writeAsStringAsync(this.imagePath, base64, { encoding: 'base64' });
    this.canceler = null;
  };
  cancelRequest = () => {
    this.canceler?.('cancel');
  };
}
