import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, FormProps, message } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { CustomAddressItem, ValidData } from 'pages/Contacts/EditContact';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import DeleteContact from 'pages/Contacts/DeleteContact';
import { useDeleteContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import './index.less';

const { Item: FormItem } = Form;

export interface IEditContactFormProps extends FormProps {
  isEdit: boolean;
  isDisable: boolean;
  validName: ValidData;
  state: any;
  addressArr: CustomAddressItem[];
  handleInputValueChange: (v: string) => void;
  handleDelete: (name: any, i: any, remove: (index: number | number[]) => void) => void;
  handleSelectNetwork: (i: number) => void;
  handleAddressChange: (i: number, value: string) => void;
  handleAdd: (add: (defaultValue?: any, insertIndex?: number) => void) => void;
}

export default function EditContactForm({
  form,
  isEdit,
  isDisable,
  state,
  addressArr,
  validName,
  onFinish,
  handleInputValueChange,
  handleSelectNetwork,
  handleAddressChange,
  handleDelete,
  handleAdd,
}: IEditContactFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const symbolImages = useSymbolImages();
  const deleteContactApi = useDeleteContact();
  const [delOpen, setDelOpen] = useState<boolean>(false);

  const handleDelConfirm = useCallback(async () => {
    await deleteContactApi(state);
    navigate('/setting/contacts');
    message.success('Contact deleted successfully');
  }, [deleteContactApi, navigate, state]);

  return (
    <>
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        className="flex-column edit-contact-form"
        initialValues={state}
        requiredMark={false}
        onFinish={onFinish}>
        <div className="form-content">
          <FormItem name="name" label={t('Name')} validateStatus={validName.validateStatus} help={validName.errorMsg}>
            <Input
              placeholder={t('Enter name')}
              onChange={(e) => handleInputValueChange(e.target.value)}
              maxLength={16}
            />
          </FormItem>
          <Form.List name="addresses">
            {(fields, { add, remove }) => (
              <div className="addresses">
                {fields.map(({ key, name, ...restField }, i) => (
                  <div className="address-item" key={key}>
                    <div className="flex-between address-item-title">
                      <span>{`Address${i + 1}`}</span>
                      <CustomSvg
                        type="Delete"
                        className="address-item-delete"
                        onClick={() => handleDelete(name, i, remove)}
                      />
                    </div>
                    <Input.Group compact className="flex-column address-item-body">
                      <FormItem {...restField} name={[name, 'networkName']} noStyle>
                        <Input
                          placeholder="Select Network"
                          prefix={<img className="select-svg" src={symbolImages['ELF']} />}
                          suffix={
                            <CustomSvg
                              type="Down"
                              onClick={() => {
                                handleSelectNetwork(i);
                              }}
                            />
                          }
                          onClick={() => {
                            handleSelectNetwork(i);
                          }}
                        />
                      </FormItem>
                      <FormItem
                        {...restField}
                        name={[name, 'address']}
                        validateStatus={addressArr?.[i]?.validData?.validateStatus}
                        help={addressArr?.[i]?.validData?.errorMsg}>
                        <Input
                          onChange={(e) => handleAddressChange(i, e.target.value)}
                          placeholder={t("Enter contact's address")}
                          addonBefore="ELF"
                          addonAfter={addressArr[i]?.chainId}
                        />
                      </FormItem>
                    </Input.Group>
                  </div>
                ))}
                {fields.length < 5 && (
                  <div className="flex-center addresses-add-btn" onClick={() => handleAdd(add)}>
                    <CustomSvg type="PlusFilled" className="plus-svg" />
                    <span>{t('Add Address')}</span>
                  </div>
                )}
              </div>
            )}
          </Form.List>
        </div>
        <div className="form-btn">
          {!isEdit && (
            <div className="form-btn-add">
              <FormItem>
                <Button className="add-btn" type="primary" htmlType="submit" disabled={isDisable}>
                  {t('Add')}
                </Button>
              </FormItem>
            </div>
          )}
          {isEdit && (
            <div className="flex-between form-btn-edit">
              <Button
                danger
                onClick={() => {
                  setDelOpen(true);
                }}>
                {t('Delete')}
              </Button>
              <Button htmlType="submit" type="primary" disabled={isDisable}>
                {t('Save')}
              </Button>
            </div>
          )}
        </div>
      </Form>
      <DeleteContact
        open={delOpen}
        onCancel={() => {
          setDelOpen(false);
        }}
        onConfirm={handleDelConfirm}
      />
    </>
  );
}
