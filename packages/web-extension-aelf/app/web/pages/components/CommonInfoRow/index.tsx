import { CommonModalTip } from '@portkey/did-ui-react';
import './index.less';
import { CustomSvgV3, SvgTypeV3 } from 'components/CustomSvgV3';

interface ILabel {
  text: string;
  tooltipProps?: {
    title: string;
    content: string;
  };
}

interface IValue {
  text?: string;
  content?: React.ReactNode;
  leftImageUrl?: string;
  leftSvgName?: SvgTypeV3;
  textBelow?: string;
}

interface ICommonInfoRowProps {
  label: ILabel;
  value: IValue;
}

export const CommonInfoRow = ({ label, value }: ICommonInfoRowProps) => {
  return (
    <div className="common-info-row">
      <div className="common-info-label-column-wrap">
        <div className="common-info-label-wrap">{label.text}</div>

        {label.tooltipProps && <CommonModalTip {...label.tooltipProps} />}
      </div>

      <div className="common-info-value-column-wrap">
        {value.content || (
          <>
            <div className="common-info-value-wrap">
              {value.leftImageUrl ? (
                <img className="common-info-value-image" src={value.leftImageUrl} />
              ) : (
                value.leftSvgName && <CustomSvgV3 className="common-info-value-image" type={value.leftSvgName} />
              )}

              <div className="common-info-value">{value.text}</div>
            </div>

            {value.textBelow && <div className="common-info-value-below">{value.textBelow}</div>}
          </>
        )}
      </div>
    </div>
  );
};
