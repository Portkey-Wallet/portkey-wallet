import { DotLoading, InfiniteScroll } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

export interface ILoadingMoreProps {
  hasMore?: boolean;
  loadingText?: string;
  noDataText?: string;
  className?: string;
  loadMore: (isRetry?: boolean) => Promise<void>;
}

export default function LoadingMore({
  hasMore = false,
  loadingText = 'Loading',
  noDataText = 'No Data',
  className = '',
  loadMore,
}: ILoadingMoreProps) {
  const { t } = useTranslation();

  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={100}>
      {hasMore ? (
        <>
          <span className={className}>{t(loadingText)}</span>
          <DotLoading />
        </>
      ) : (
        <span className={className}>{t(noDataText)}</span>
      )}
    </InfiniteScroll>
  );
}
