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
import {TeamPageComponent} from './pages/team/team.page';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {ThoughtsColumnComponent} from './components/thoughts-column/thoughts-column.component';
import {ThoughtService} from './services/thought.service';
import {ThoughtsHeaderComponent} from './components/thoughts-header/thoughts-header.component';
import {FormsModule} from '@angular/forms';
import {ActionsHeaderComponent} from './components/actions-header/actions-header.component';
import {ActionsColumnComponent} from './components/actions-column/actions-column.component';
import {TeamService} from './services/team.service';
import {ActionItemService} from './services/action.service';
import {ColumnService} from './services/column.service';
import {WebsocketService} from './services/websocket.service';
import {FeedbackService} from './services/feedback.service';
import {AuthGuard} from '../auth/auth-guard/auth.guard';
import {TeamPageQueryParamGuard} from './services/team-page-query-param-guard';
import {ControlsModule} from '../controls/controls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'team/:teamId', component: TeamPageComponent, canActivate: [AuthGuard]},
      {path: 'team', component: TeamPageComponent, canActivate: [TeamPageQueryParamGuard]},
    ]),
    ControlsModule
  ],
  providers: [
    ThoughtService,
    TeamService,
    ActionItemService,
    ColumnService,
    WebsocketService,
    FeedbackService
  ],
  declarations: [
    TeamPageComponent,
    HeaderComponent,
    ThoughtsColumnComponent,
    ThoughtsHeaderComponent,
    ActionsHeaderComponent,
    ActionsColumnComponent
  ]
})
export class TeamsModule {
}
