import { Button, Form, Input, FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import './index.less';
import { CustomAddressItem, ValidData } from 'pages/Contacts/AddContact';

const { Item: FormItem } = Form;

export interface IAddContactFormProps extends FormProps {
  isDisable: boolean;
  validName: ValidData;
  state: any;
  addressArr: CustomAddressItem[];
  handleInputValueChange: (v: string) => void;
  handleSelectNetwork: (i: number) => void;
  handleAddressChange: (i: number, value: string) => void;
}

export default function AddContactForm({
  form,
  isDisable,
  state,
  addressArr,
  validName,
  onFinish,
  handleInputValueChange,
  handleSelectNetwork,
  handleAddressChange,
}: IAddContactFormProps) {
  const { t } = useTranslation();
  const symbolImages = useSymbolImages();

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      className="flex-column add-contact-form"
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
          {(fields) => (
            <div className="addresses">
              {fields.map(({ key, name, ...restField }, i) => (
                <div className="address-item" key={key}>
                  <div className="flex-between address-item-title">{`Address`}</div>
                  <Input.Group compact className="flex-column address-item-body">
                    <FormItem {...restField} name={[name, 'networkName']} noStyle>
                      <Input
                        placeholder="Select Network"
                        disabled
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
            </div>
          )}
        </Form.List>
      </div>
      <FormItem className="form-btn">
        <Button className="add-btn" type="primary" htmlType="submit" disabled={isDisable}>
          {t('Add')}
        </Button>
      </FormItem>
    </Form>
  );
}
