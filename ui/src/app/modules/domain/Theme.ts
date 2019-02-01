/*
 * Copyright (c) 2018 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum Themes {
  Light,
  Dark,
  None,
}

export function parseTheme(themeString: string): Themes {
  if (themeString === 'light') {
    return Themes.Light;
  } else if (themeString === 'dark') {
    return Themes.Dark;
  }

  return Themes.None;
}

export function themeToString(theme: Themes): string {
  if (theme === Themes.Light) {
    return 'light';
  } else if (theme === Themes.Dark) {
    return 'dark';
  }

  return '';
}

export function getAllThemesAsString(): Array<string> {
  const result = [];
  for ( let themeStr in Themes) {
    const theme = Number(themeStr);
    if(!isNaN(theme) && theme != Themes.None) {
      result.push(themeToString(theme));
    }
  }


  return result;
}
