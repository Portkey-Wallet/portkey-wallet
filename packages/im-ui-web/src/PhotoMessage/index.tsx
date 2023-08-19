import React, { useMemo, useState } from 'react';
import { Image } from 'antd';
import clsx from 'clsx';

import { IPhotoMessageProps } from '../type';
import { formatTime } from '../utils';
import CustomSvg from '../components/CustomSvg';
import './index.less';

const PhotoMessage: React.FC<IPhotoMessageProps> = props => {
  const showDate = useMemo(() => (props.dateString ? props.dateString : formatTime(props.date as any)), []);
  const [loadErr, setLoadErr] = useState(false);

  return (
    <div className={clsx(['portkey-message-photo', 'flex', props.position])}>
      <div className={clsx(['photo-body', props.position])}>
        {loadErr ? (
          <div className="photo-error">
            <CustomSvg type="ImgErr" />
          </div>
        ) : (
          <>
            <Image src={props?.data?.uri} onError={() => setLoadErr(true)} />
            <div className="photo-date">{showDate}</div>
          </>
        )}
        {/* {!error && props?.data?.status && !props?.data?.status?.download && (
          <div className="portkey-mbox-photo--img__block">
            {!props?.data?.status.click && (
              <button
                onClick={props.onDownload}
                className="portkey-mbox-photo--img__block-item portkey-mbox-photo--download">
                <FaCloudDownloadAlt />
              </button>
            )}
            {typeof props?.data?.status.loading === 'number' && props?.data?.status.loading !== 0 && (
              // TODO progress
              <></>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PhotoMessage;
