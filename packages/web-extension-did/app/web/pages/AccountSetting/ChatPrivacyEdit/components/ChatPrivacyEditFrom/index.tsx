import { Form, FormProps, Input } from 'antd';
import { FormItem } from 'components/BaseAntd';
import { useTranslation } from 'react-i18next';
import './index.less';

interface IChatPrivacyEditFromProps extends FormProps {
  state?: any; // TODO
}

export default function ChatPrivacyEditFrom({ form, state }: IChatPrivacyEditFromProps) {
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      colon={false}
      layout="vertical"
      className="flex-column-between chat-privacy-edit-form"
      initialValues={state}>
      <div className="form-content">
        <FormItem name="account" label={t('My login')}>
          <Input placeholder={t('My login account')} disabled={true} />
        </FormItem>
      </div>
    </Form>
  );
}
