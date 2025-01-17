import { useTranslation } from 'react-i18next';
import { CustomModalBottom } from '../../../components/CustomModalBottom';
import { CustomSvgV3 } from '../../../../components/CustomSvgV3';
import './index.less';

export const HelpIcon = () => {
  const { t } = useTranslation();
  return (
    <CustomSvgV3
      onClick={() => {
        CustomModalBottom({
          isPrompt: true,
          promptInfo: {
            width: 343,
          },
          type: 'info',
          title: t('Guardian verifier'),
          content: (
            <div className="text-14">
              {t(
                "Verifiers are external services that boost security and decentralization in Portkey's social recovery system. Note: Used verifiers can't be selected again, except for zkLogin. For zkLogin, your guardian must be a Google account or Apple ID.",
              )}
            </div>
          ),
          okText: t('OK'),
        });
      }}
      type="help"
      className="help-icon"
      fillColor="#FFFFFFB3"
    />
  );
};
