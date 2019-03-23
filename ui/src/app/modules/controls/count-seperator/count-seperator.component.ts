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

import {Component, Input} from '@angular/core';
import {Themes} from '../../domain/Theme';

@Component({
  selector: 'rq-count-seperator',
  templateUrl: './count-seperator.component.html',
  styleUrls: ['./count-seperator.component.scss'],
  host: {
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class CountSeperatorComponent {

  @Input() count = 0;
  @Input() theme = Themes.Light;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

}
