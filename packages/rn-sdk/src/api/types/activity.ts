import { ActivityItemType } from 'network/dto/query';

// export type { ActivityDetailPropsType } from 'pages/Activity/ActivityDetail';
export type ActivityDetailPropsType = {
  item: ActivityItemType;
  multiCaAddresses: {
    [key: string]: string;
  };
};
export interface IActivityService {
  openActivityList(): Promise<void>;
  openActivityDetail(props: ActivityDetailPropsType): Promise<void>;
}
