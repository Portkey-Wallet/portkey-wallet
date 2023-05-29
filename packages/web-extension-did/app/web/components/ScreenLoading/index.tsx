import Loading from 'components/Loading';
import { useAppSelector } from 'store/Provider/hooks';
import './index.less';

export default function ScreenLoading() {
  const {
    loadingInfo: { isLoading, loadingText },
  } = useAppSelector((state) => state.userInfo);

  console.log(isLoading, 'isLoading===');
  return (
    <>
      {!!isLoading && (
        <div
          className="fix-max-content portkey-loading-wrapper"
          style={
            typeof isLoading !== 'number'
              ? {}
              : {
                  backgroundColor: `rgb(00 00 00 / ${isLoading * 100}%)`,
                }
          }>
          <div className="loading-indicator flex-column-center">
            <Loading />
            <div className="loading-text">{loadingText ? loadingText : 'Loading...'}</div>
          </div>
        </div>
      )}
    </>
  );
}
