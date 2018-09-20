const emojiMap = {
  ':D': '😃',
  ':)': '🙂',
  ';)': '😏',
  ':(': '😥',
  ':p': '😋',
  ':|': '😐',
  ';p': '\uD83D\uDE1C',
  ':\'(': '😭',
  '^^': '😊'
};

function escapeSpecialChars(regex) {
  return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

export function emojify(str: string): string {

  for (const key of Object.keys(emojiMap)) {
    const regex = new RegExp(escapeSpecialChars(key), 'gim');
    str = str.replace(regex, emojiMap[key]);
  }

  return str;
}
