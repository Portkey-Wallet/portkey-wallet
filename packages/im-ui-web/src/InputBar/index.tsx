import { useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';

import { emojiList } from '../assets/index';
import CustomSvg from '../components/CustomSvg';
import PopoverMenuList, { IPopoverMenuListData } from '../PopoverMenuList';
import Input from '../ChatInput';
import './index.less';
// import { getPixel } from '../utils';

interface IInputBar {
  moreData?: IPopoverMenuListData[];
  showEmoji?: boolean;
}

export default function InputBar({ moreData, showEmoji = true, ...props }: IInputBar) {
  console.log(props);
  const [showIcon, setShowIcon] = useState(false);
  const [value, setValue] = useState('');
  // const [file, setFile] = useState();
  // const [previewImage, setPreviewImage] = useState<any>();

  const handleShowIcon = () => {
    if (showIcon) {
      setShowIcon(false);
    } else {
      setShowIcon(true);
    }
  };

  // const handleUpload = () => {
  //   const formData = new FormData();
  //   formData.append('file', file as any);

  //   // setUploading(true);
  //   // You can use any AJAX library you like
  //   fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(res => res.json())
  //     .then(() => {
  //       // setFileList([]);
  //       message.success('upload successfully.');
  //     })
  //     .catch(() => {
  //       message.error('upload failed.');
  //     })
  //     .finally(() => {
  //       // setUploading(false);
  //     });
  // };

  // const xprops = {
  //   beforeUpload: async (fileParams: any) => {
  //     console.log('fileParams', fileParams);
  //     // const [width, height] = await getPixel('https://avatars.githubusercontent.com/u/80540635?v=4');
  //     // console.log('fileParams img', img);
  //     const isPNG = fileParams.type === 'image/jpeg';
  //     if (!isPNG) {
  //       // message.error(`${fileParams.name} is not a png fileParams`);
  //       return isPNG || Upload.LIST_IGNORE;
  //     } else {
  //       setFile(fileParams);
  //       const reader = new FileReader();
  //       reader.readAsDataURL(fileParams);
  //       reader.onload = e => {
  //         setPreviewImage(e.target?.result);
  //       };
  //       reader.readAsDataURL(fileParams);
  //     }
  //     return false;
  //   },
  //   // onChange: info => {
  //   //   console.log(info.fileList);
  //   // },
  // };
  // const onClick = () => {
  //   // TODO
  // };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <div className="portkey-input-bar">
        {showIcon && (
          <div className="input-emoji">
            <div className="show-icon flex">
              {emojiList.map(item => (
                <div className="item" key={item.name} onClick={() => {}}>
                  <div className="icon">{item.code}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex input-box">
          {moreData ? (
            <Popover
              overlayClassName="portkey-input-more-popover"
              placement="right"
              trigger="click"
              showArrow={false}
              content={<PopoverMenuList data={moreData} />}>
              <CustomSvg type="File" />
            </Popover>
          ) : (
            <CustomSvg type="File" />
          )}

          <div className="input-text">
            <Input value={value} multiline={true} maxHeight={100} onChange={handleChange} />
            {showEmoji && (
              <CustomSvg className={clsx([showIcon && 'has-show-icon'])} type="Emoji" onClick={handleShowIcon} />
            )}
          </div>
          {value && <CustomSvg type="Send" onClick={handleShowIcon} />}
        </div>
        {/* <Upload showUploadList={false} {...props}>
          <Button>选择图片</Button>
          {previewImage && <img src={previewImage} alt="预览图" style={{ width: '100%' }} />}
        </Upload>
        {file && <Button onClick={handleUpload}>Send</Button>} */}
      </div>
      {/* </div> */}
    </div>
  );
}
