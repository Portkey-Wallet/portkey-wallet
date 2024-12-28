import { Button, Form, Input, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
// import CustomSvg from 'components/CustomSvg';
import './index.less';
import { ContactInfoError, CustomAddressItem, ValidData } from 'pages/Contacts/AddContact';
// import EditButtonGroup from '../EditButtonGroup';
// import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-ca/config';
// import { useEffectOnce } from '@portkey-wallet/hooks';
// import { IContactSupportNetworkItem } from '@portkey-wallet/types/types-ca/config';
// import { IContactItemType, IEditContactItemApiType } from '@portkey-wallet/types/types-ca/contactNew';
import { defaultContactFormData, useContactAction, useDefaultContactFormValue } from '../../AddContact/hooks';
import { IEditContactItemFormType } from 'pages/Contacts/AddContact/types';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import AddContactAddressInfoSection from '../AddressInfoForm';

const { Item: FormItem } = Form;

export interface IAddContactFormProps extends FormProps {
  isDisable?: boolean;
  validName: ValidData;
  state: any;
  extra?: ContactHandleActionTypeEnum;
  handleAddressInfoChange: (v: IEditContactItemFormType['addressInfo']) => void;
  isNetworkModalOpen?: boolean;
  handleNetworkModalState: (isShow: boolean) => void;
}

export default function AddContactForm({
  form,
  isDisable,
  validName,
  extra,
  onFinish,
  handleAddressInfoChange,
  handleNetworkModalState,
}: IAddContactFormProps) {
  // TODO: change it to real data
  const { t } = useTranslation();

  return (
    <Form
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
            onChange={handleAddressInfoChange}
            handleNetworkModalState={handleNetworkModalState}
          />
        </FormItem>
      </div>

      <FormItem className="form-btn">
        <Button className="add-btn" type="primary" htmlType="submit" disabled={isDisable}>
          {t('Save address')}
        </Button>
      </FormItem>

      {/* 
      {extra !== ExtraTypeEnum.ADD_NEW_CHAT && <EditButtonGroup className="form-btn" />} */}
    </Form>
  );
}
