import { Button, Input } from 'antd';
import FreeMintUpload from '../Upload';
import './index.less';

export interface IFreeMintEdit {
  getFile?(file: File | undefined): void;
  getPreviewFile(file: string): void;
  setNewAvatarS3File(file: string): void;
  previewFile?: string;
  nftName: string;
  onNftNameChange(v: string): void;
  desc: string;
  onDescChange(v: string): void;
  btnDisabled: boolean;
  onClickNext(): void;
}

export default function Edit({
  getFile,
  getPreviewFile,
  setNewAvatarS3File,
  previewFile,
  nftName,
  onNftNameChange,
  desc,
  onDescChange,
  btnDisabled,
  onClickNext,
}: IFreeMintEdit) {
  return (
    <div className="free-mint-edit flex-column-between flex-1">
      <div className="edit-container flex-1 flex-column">
        <FreeMintUpload
          className="free-mint-upload"
          getFile={getFile}
          getPreviewFile={getPreviewFile}
          previewFile={previewFile}
          setNewAvatarS3File={setNewAvatarS3File}
        />
        <div className="flex-column gap-8">
          <div className="label">Name</div>
          <Input
            placeholder="Give your NFT a unique name"
            value={nftName}
            onChange={(e) => onNftNameChange(e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="flex-column gap-8">
          <div className="label">{`Description (Optional)`}</div>
          <Input.TextArea
            // eslint-disable-next-line no-inline-styles/no-inline-styles
            style={{ resize: 'none', height: 80 }}
            rows={3}
            maxLength={1000}
            value={desc}
            placeholder="Tell people more about your NFT"
            onChange={(e) => onDescChange(e.target.value)}
          />
        </div>
      </div>
      <div className="btn-container">
        <Button type="primary" disabled={btnDisabled} onClick={onClickNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
