import { ReportMessageEnum, ReportMessageList } from '@portkey-wallet/constants/constants-ca/chat';
import { Button, Input } from 'antd';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo, useState } from 'react';
import './index.less';

export interface IReportParams {
  reportType: ReportMessageEnum;
  description: string;
}

export interface IReportProps {
  onCloseReport: () => void;
  onReport: (params: IReportParams) => void;
}

export default function Report({ onCloseReport, onReport }: IReportProps) {
  const [select, setSelect] = useState<ReportMessageEnum>();
  const [text, setText] = useState('');
  const disabled = useMemo(() => {
    if (!select) return true;
    if (select === ReportMessageEnum.Other) {
      return !text;
    }
    return false;
  }, [select, text]);
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const _target = e.target.value;
    setText(_target);
  }, []);
  const handleClose = useCallback(() => {
    setSelect(undefined);
    setText('');
    onCloseReport();
  }, [onCloseReport]);
  const handleReport = useCallback(() => {
    onReport({ reportType: select!, description: select === ReportMessageEnum.Other ? text : '' });
    handleClose();
  }, [handleClose, onReport, select, text]);

  return (
    <div className="chat-report-page flex-column">
      <div className="report-page-header">
        <CommonHeader
          title="Report"
          rightElementList={[
            {
              customSvgType: 'SuggestClose',
              onClick: handleClose,
            },
          ]}
        />
      </div>
      <div className="report-page-content flex-1 flex-column">
        <div className="report-page-list flex-1">
          {ReportMessageList.map((item, index) => (
            <div
              key={`report_${index}`}
              className="report-list-item flex-row-center"
              onClick={() => setSelect(item.value)}>
              <CustomSvg type={item.value === select ? 'Selected3' : 'NotSelected'} />
              <span>{item.title}</span>
            </div>
          ))}
          <div className="flex content-textarea">
            <Input.TextArea
              // eslint-disable-next-line no-inline-styles/no-inline-styles
              style={{ resize: 'none', height: 80 }}
              rows={2}
              maxLength={500}
              placeholder="Please enter any additional details relevant to your report."
              onChange={handleTextChange}
            />
          </div>
        </div>
        <div className="report-page-footer flex">
          <Button className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" type="primary" disabled={disabled} onClick={handleReport}>
            Report
          </Button>
        </div>
      </div>
    </div>
  );
}
