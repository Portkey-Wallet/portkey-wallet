import usePromptSearch from 'hooks/usePromptSearch';

export default function ConnectWallet() {
  const detail = usePromptSearch();
  return <div>{JSON.stringify(detail)}</div>;
}
