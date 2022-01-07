/*
 * Copyright (c) 2022 Ford Motor Company
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';

import { ReactLoginPageWrapper } from '../../../react/pages/login/ReactLoginPageWrapper';

import { ActionBarComponent } from './action-bar/action-bar.component';
import { ActionItemDialogComponent } from './action-item-dialog/action-item-dialog.component';
import { ActionItemTaskComponent } from './action-item-task/action-item-task.component';
import { ActionsRadiatorViewComponent } from './actions-radiator-view/actions-radiator-view.component';
import { ButtonComponent } from './button/button.component';
import { ColumnHeaderComponent } from './column-header/column-header.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { CountSeperatorComponent } from './count-seperator/count-seperator.component';
import { DeletionOverlayComponent } from './deletion-overlay/deletion-overlay.component';
import { EndRetroDialogComponent } from './end-retro-dialog/end-retro-dialog.component';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { FloatingCharacterCountdownComponent } from './floating-character-countdown/floating-character-countdown.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { PageLogoComponent } from './page-logo/page-logo.component';
import { RqPageComponent } from './rq-page/rq-page.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { StyleGuidePageComponent } from './style-guide-page/style-guide-page.component';
import { TaskComponent } from './task/task.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: 'styleguide', component: StyleGuidePageComponent }]),
    RecaptchaModule,
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
    EndRetroDialogComponent,
    FeedbackDialogComponent,
    ActionsRadiatorViewComponent,
    DeletionOverlayComponent,
    TooltipComponent,
    SettingsDialogComponent,
    PageLogoComponent,
    LoginFormComponent,
    ContributorsComponent,
    ReactLoginPageWrapper,
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
    EndRetroDialogComponent,
    FeedbackDialogComponent,
    ActionsRadiatorViewComponent,
    DeletionOverlayComponent,
    SettingsDialogComponent,
    PageLogoComponent,
    LoginFormComponent,
  ],
})
export class ComponentsModule {}
