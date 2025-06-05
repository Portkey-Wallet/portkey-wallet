import './index.less';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps } from 'types/Profile';

export default function ViewContactPrompt({ headerTitle, goBack, data }: IProfileDetailProps) {
  return (
    <div className="view-contact-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <ViewContactBody data={data} />
    </div>
  );
}
