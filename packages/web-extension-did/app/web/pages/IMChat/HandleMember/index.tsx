import { useMemo } from 'react';
import { useParams } from 'react-router';
import AddMember from './AddMember';
import RemoveMember from './RemoveMember';
import './index.less';

export default function HandleMember() {
  const { operate } = useParams();
  const isAddMember = useMemo(() => operate === 'add', [operate]);
  return isAddMember ? <AddMember /> : <RemoveMember />;
}
