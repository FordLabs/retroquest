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

import {Injectable} from '@angular/core';

export enum Themes {
  Light,
  Dark
}

@Injectable()
export class ThemeSelectorService {

  public static currentTheme = Themes.Light;

  public setDocumentBackgroundColor(theme: Themes) {

    let chosenColor = '';

    if (Themes.Dark === theme) {
      chosenColor = '#1A1A1A';
      ThemeSelectorService.currentTheme = Themes.Dark;
    } else if (Themes.Light === theme) {
      chosenColor = '#ecf0f1';
      ThemeSelectorService.currentTheme = Themes.Light;
    }

    window.document.body.style.backgroundColor = chosenColor;
    console.log(window.document.body.style.backgroundColor);

  }

}
