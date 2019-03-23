/*
 *  Copyright (c) 2018 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
