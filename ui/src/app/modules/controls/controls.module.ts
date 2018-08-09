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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from './button/button.component';
import {StyleGuidePageComponent} from './style-guide-page/style-guide-page.component';
import {RouterModule} from '@angular/router';
import { RqPageComponent } from './rq-page/rq-page.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { TextFieldComponent } from './text-field/text-field.component';
import {FormsModule} from '@angular/forms';
import { CountSeperatorComponent } from './count-seperator/count-seperator.component';
import { ColumnHeaderComponent } from './column-header/column-header.component';
import { FloatingCharacterCountdownComponent } from './floating-character-countdown/floating-character-countdown.component';
import {TaskComponent} from './task/task.component';
import {ActionItemTaskComponent} from './action-item-task/action-item-task.component';
import {TaskDialogComponent} from './task-dialog/task-dialog.component';
import {ActionItemDialogComponent} from './action-item-dialog/action-item-dialog.component';
import {EndRetroDialogComponent} from './end-retro-dialog/end-retro-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'styleguide', component: StyleGuidePageComponent},
    ])
  ],
  declarations: [
    ButtonComponent,
    StyleGuidePageComponent,
    RqPageComponent,
    ActionBarComponent,
    TextFieldComponent,
    CountSeperatorComponent,
    ColumnHeaderComponent,
    TaskComponent,
    TaskDialogComponent,
    FloatingCharacterCountdownComponent,
    ActionItemTaskComponent,
    ActionItemDialogComponent,
    EndRetroDialogComponent
  ],

  exports: [
    ButtonComponent,
    StyleGuidePageComponent,
    RqPageComponent,
    ActionBarComponent,
    TextFieldComponent,
    CountSeperatorComponent,
    ColumnHeaderComponent,
    TaskComponent,
    TaskDialogComponent,
    FloatingCharacterCountdownComponent,
    ActionItemTaskComponent,
    ActionItemDialogComponent,
    EndRetroDialogComponent
  ]

})
export class ControlsModule { }
