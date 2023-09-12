import { List } from 'antd-mobile';
import './index.less';
import clsx from 'clsx';
import SearchItem, { ISearchItem } from '../SearchItem';

export interface ISearchListProps {
  list: ISearchItem[];
  className?: string;
  clickItem: (item: ISearchItem) => void;
}

export default function SearchList({ className, list, clickItem }: ISearchListProps) {
  return (
    <List className={clsx(['search-list', className])}>
      {list.map((item) => (
        <List.Item key={`${item.id}_${item.name}`} onClick={() => clickItem(item)}>
          <SearchItem item={item} />
        </List.Item>
      ))}
    </List>
  );
}
