/*
 *  Copyright (c) 2020 Ford Motor Company
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
  selector: 'rq-floating-character-countdown',
  templateUrl: './floating-character-countdown.component.html',
  styleUrls: ['./floating-character-countdown.component.scss'],
  host: {
    '[class.display-warning-text]': 'charactersRemainingAreAboutToRunOut()',
    '[style.visibility]': 'textIsEmpty() ? \'hidden\' : \'visible\'',
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class FloatingCharacterCountdownComponent {

  @Input() maxCharacterCount = 255;
  @Input() charsAreRunningOutThreshold = 50;
  @Input() characterCount = 0;
  @Input() theme: Themes = Themes.Light;

  public charactersRemaining(): number {
    return this.maxCharacterCount - this.characterCount;
  }

  public charactersRemainingAreAboutToRunOut(): boolean {
    return this.charactersRemaining() < this.charsAreRunningOutThreshold;
  }

  public textIsEmpty(): boolean {
    return this.characterCount === 0;
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

}
