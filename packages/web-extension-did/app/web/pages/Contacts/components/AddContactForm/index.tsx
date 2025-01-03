import { Button, Form, Input, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import { ContactInfoError, ValidData } from 'pages/Contacts/AddContact';
import { defaultContactFormData } from '../../AddContact/hooks';
import { IEditContactItemFormType } from 'pages/Contacts/AddContact/types';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import AddContactAddressInfoSection from '../AddressInfoForm';
import { useCallback, useState } from 'react';
import { useEffectOnce } from '@portkey-wallet/hooks';

const { Item: FormItem } = Form;

export interface IAddContactFormProps extends FormProps {
  isDisable?: boolean;
  validName: ValidData;
  state?: any;
  extra?: ContactHandleActionTypeEnum;
  handleAddressInfoChange: (v: IEditContactItemFormType['addressInfo']) => void;
  isNetworkModalOpen?: boolean;
  handleNetworkModalState: (isShow: boolean) => void;
}

export default function AddContactForm({
  form,
  validName,
  // extra,
  onFinish,
  isNetworkModalOpen,
  handleAddressInfoChange,
  handleNetworkModalState,
}: IAddContactFormProps) {
  // TODO: change it to real data
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState<boolean>(false);

  const changeDisabled = useCallback(() => {
    if (!form) return;
    const { addressInfo, contactName } = form.getFieldsValue();
    const _disabled = !contactName?.trim() || !addressInfo?.address?.trim();
    setDisabled(_disabled);
  }, [form]);

  useEffectOnce(() => {
    changeDisabled();
  });

  return (
    <Form
      onChange={changeDisabled}
      form={form}
      initialValues={defaultContactFormData}
      autoComplete="off"
      layout="vertical"
      className="flex-column add-contact-form"
      requiredMark={false}
      onFinish={onFinish}>
      <div className="form-content">
        <FormItem
          name="contactName"
          label={t('Name')}
          rules={[
            {
              required: true,
              whitespace: true,
              max: 16,
            },
            {
              pattern: /^[a-zA-Z0-9_ ]+$/,
              message: ContactInfoError.inValidName,
            },
          ]}>
          <Input placeholder={t('Enter name')} maxLength={16} />
        </FormItem>

        <FormItem
          name="addressInfo"
          label={t('Address')}
          validateStatus={validName.validateStatus}
          help={validName.errorMsg}>
          <AddContactAddressInfoSection
            form={form}
            isNetworkModalOpen={isNetworkModalOpen}
            onChange={handleAddressInfoChange}
            handleNetworkModalState={handleNetworkModalState}
          />
        </FormItem>
      </div>

      <FormItem className="form-btn">
        <Button className="add-btn" type="primary" htmlType="submit" disabled={disabled}>
          {t('Save address')}
        </Button>
      </FormItem>
    </Form>
  );
}
