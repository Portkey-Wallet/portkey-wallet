import emoticonData from './emoticonData.json';
const emojiList: { name: string; code: string }[] = [];
for (const key in emoticonData) {
  emojiList.push({ name: key, code: (emoticonData as { [key: string]: string })[key] });
}
export { emojiList };
