export default function getHostname() {
  let host = location.hostname || location.host;
  const protocol = location.href;

  if (!protocol.includes('http')) {
    host = 'OnlyForTest!!!';
  }

  // Replacing www. only if the domain starts with it.
  if (host.indexOf('www.') === 0) {
    host = host.replace('www.', '');
  }

  return host;
}

export function getUrl() {
  return new URL(location.href);
}
