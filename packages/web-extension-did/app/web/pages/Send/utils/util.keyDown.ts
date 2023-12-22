export function handleKeyDown(e: { key: string; preventDefault: () => any }) {
  const allow = [
    ...Array(10)
      .fill('')
      .map((_v, i) => i.toString()),
    ' .',
    '.',
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];
  if (!allow.includes(e.key)) {
    e.preventDefault();
  }
}
export function handleKeyDownInt(e: { key: string; preventDefault: () => any }) {
  const allow = [
    ...Array(10)
      .fill('')
      .map((_v, i) => i.toString()),
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];
  if (!allow.includes(e.key)) {
    e.preventDefault();
  }
}
