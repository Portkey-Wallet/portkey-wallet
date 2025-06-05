export function shortenCharacters(str: string) {
  if (!str || str.length <= 8) return str;

  const reg = /([a-zA-Z0-9]{4}).*([a-zA-Z0-9]{4})/;
  return str.replace(reg, '$1...$2');
}
