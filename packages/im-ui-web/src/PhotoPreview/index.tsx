import React from 'react';

import './index.less';

// import CustomSvg from '../components/CustomSvg';
import { IPhotoPreviewProps } from '../type';

const PhotoPreview: React.FC<IPhotoPreviewProps> = props => {
  const handleClose = (e: any) => {
    if (e.target.id !== 'image') props.onClose();
  };
  return (
    <div className="portkey-preview-photo flex-center" onClick={handleClose}>
      <div className="portkey-photo-img">
        {/* <CustomSvg type="Close2" /> */}
        <img id="image" src={props.uri} alt={props.alt || 'image-preview'} />
      </div>
    </div>
  );
};

export default PhotoPreview;
