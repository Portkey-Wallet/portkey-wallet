import { Form, Input, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import IdAndAddress from '../IdAndAddress';
import './index.less';
import { ValidData } from 'pages/Contacts/AddContact';
import EditButtonGroup from '../EditButtonGroup';
import LoginAccountList from '../LoginAccountList';
import Avatar from 'pages/components/Avatar';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';

const { Item: FormItem } = Form;

export interface IEditContactFormProps extends FormProps {
  state: any;
  validName: ValidData;
  validRemark?: ValidData;
  isShowRemark?: boolean;
  cantSave?: boolean;
  handleInputRemarkChange: (v: string) => void;
}

export default function EditContactForm({
  form,
  state,
  validName,
  validRemark,
  isShowRemark = true,
  cantSave = false,
  handleInputRemarkChange,
  onFinish,
}: IEditContactFormProps) {
  const { t } = useTranslation();
  const { index } = useIndexAndName(state as Partial<ContactItemType>);

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column edit-contact-form"
      initialValues={state}
      requiredMark={false}
      onFinish={onFinish}>
      <div className="edit-contact-form-body flex-1">
        <div className="form-content">
          <div className="flex-center upload-avatar-wrapper">
            <Avatar avatarUrl={state?.avatar} nameIndex={index} size="large" />
          </div>

          <FormItem
            name="walletName"
            label={t('Wallet Name')}
            validateStatus={validName.validateStatus}
            help={validName.errorMsg}>
            <Input placeholder={t('Enter name')} maxLength={16} disabled={true} />
          </FormItem>

          {isShowRemark && (
            <FormItem
              name="remark"
              label={t('Remark')}
              validateStatus={validRemark?.validateStatus}
              help={validRemark?.errorMsg}>
              <Input
                placeholder={t('Not set')}
                onChange={(e) => handleInputRemarkChange(e.target.value)}
                maxLength={16}
              />
            </FormItem>
          )}
        </div>

        <IdAndAddress
          portkeyId={state?.imInfo?.portkeyId}
          relationId={state?.imInfo?.relationId}
          addresses={state?.addresses || []}
        />

        {/* login account info */}
        <LoginAccountList
          Email={state?.loginAccountMap?.Email}
          Phone={state?.loginAccountMap?.Phone}
          Google={state?.loginAccountMap?.Google}
          Apple={state?.loginAccountMap?.Apple}
        />
      </div>

      <EditButtonGroup className="form-btn" data={state} cantSave={cantSave} />
    </Form>
  );
}
