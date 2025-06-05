import type { MenuProps } from 'antd';

export enum SuccessPageType {
  Creating = 'Creating',
  Created = 'Created',
  Importing = 'Importing',
  Imported = 'Imported',
  Login = 'Login',
}

export type MenuClickEventHandler = Required<MenuProps>['onClick'];

export type MenuItemType = MenuProps['items'];

export interface BaseHeaderProps {
  headerTitle: string;
  goBack?: () => void;
}
