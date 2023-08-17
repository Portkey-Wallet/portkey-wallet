import React, { useMemo } from 'react';
import clsx from 'clsx';

import { IPhotoMessageProps } from '../type';
import { formatTime } from '../utils';
import './index.less';

const PhotoMessage: React.FC<IPhotoMessageProps> = props => {
  const showDate = useMemo(() => (props.dateString ? props.dateString : formatTime(props.date as any)), []);
  const error = props?.data?.status && props?.data?.status.error === true;

  return (
    <div className={clsx(['portkey-message-photo', 'flex', props.position])}>
      <div className={clsx(['photo-body', props.position])}>
        <img
          src={props?.data?.uri}
          alt={props?.data?.alt}
          onClick={props.onOpen}
          onLoad={props.onLoad}
          onError={props.onPhotoError}
        />
        {/* TODO */}
        {error && <div>Error</div>}
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
        <div className="photo-date">{showDate}</div>
      </div>
    </div>
  );
};

export default PhotoMessage;
