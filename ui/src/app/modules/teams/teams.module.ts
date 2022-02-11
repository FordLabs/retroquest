/*
 * Copyright (c) 2021 Ford Motor Company
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

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { environment } from '../../../environments/environment';
import { ReactHeaderComponentWrapper } from '../../../react/components/header/ReactHeaderComponentWrapper';
import { AuthGuard } from '../auth/auth-guard/auth.guard';
import { ActionsRadiatorViewComponent } from '../components/actions-radiator-view/actions-radiator-view.component';
import { ComponentsModule } from '../components/components.module';
import { TopHeaderComponent } from '../components/top-header/top-header.component';
import { SubAppComponent } from '../sub-app/sub-app.component';

import { ActionsColumnComponent } from './components/actions-column/actions-column.component';
import { ActionsHeaderComponent } from './components/actions-header/actions-header.component';
import { BoardSummaryComponent } from './components/board-summary/board-summary.component';
import { HeaderComponent } from './components/header/header.component';
import { ThoughtsColumnComponent } from './components/thoughts-column/thoughts-column.component';
import { ThoughtsHeaderComponent } from './components/thoughts-header/thoughts-header.component';
import { ArchivedBoardPageComponent } from './pages/archived-board/archived-board.page';
import { ArchivesPageComponent } from './pages/archives/archives.page';
import { TeamPageComponent } from './pages/team/team.page';
import { ActionItemService } from './services/action.service';
import { ColumnService } from './services/column.service';
import { FeedbackService } from './services/feedback.service';
import { SaveCheckerService } from './services/save-checker.service';
import { TeamService } from './services/team.service';
import { TeamPageQueryParamGuard } from './services/team-page-query-param-guard';
import { ThoughtService } from './services/thought.service';

function routes() {
  return environment.useReact
    ? [
        {
          path: 'team/:teamId',
          canActivate: [TeamPageQueryParamGuard],
          component: ReactHeaderComponentWrapper,
          children: [
            {
              path: '',
              component: TeamPageComponent,
              pathMatch: 'full',
              canActivate: [AuthGuard],
            },
            {
              path: 'radiator',
              component: ActionsRadiatorViewComponent,
              canActivate: [AuthGuard],
            },
            {
              path: 'archives',
              component: ArchivesPageComponent,
              data: { teamId: ':teamId' },
              canActivate: [AuthGuard],
            },
            {
              path: 'archives/:boardId',
              component: ArchivedBoardPageComponent,
              canActivate: [AuthGuard],
            },
          ],
        },
      ]
    : [
        {
          path: 'team/:teamId',
          canActivate: [TeamPageQueryParamGuard],
          component: SubAppComponent,
          children: [
            {
              path: '',
              component: TeamPageComponent,
              pathMatch: 'full',
              canActivate: [AuthGuard],
            },
            {
              path: 'radiator',
              component: ActionsRadiatorViewComponent,
              canActivate: [AuthGuard],
            },
            {
              path: 'archives',
              component: ArchivesPageComponent,
              data: { teamId: ':teamId' },
              canActivate: [AuthGuard],
            },
            {
              path: 'archives/:boardId',
              component: ArchivedBoardPageComponent,
              canActivate: [AuthGuard],
            },
          ],
        },
      ];
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes()),
    ComponentsModule,
    InfiniteScrollModule,
    DragDropModule,
  ],
  providers: [
    ThoughtService,
    TeamService,
    ActionItemService,
    ColumnService,
    FeedbackService,
    SaveCheckerService,
  ],
  declarations: [
    TeamPageComponent,
    HeaderComponent,
    ThoughtsColumnComponent,
    ThoughtsHeaderComponent,
    ActionsHeaderComponent,
    ActionsColumnComponent,
    ArchivesPageComponent,
    BoardSummaryComponent,
    ArchivedBoardPageComponent,
    ReactHeaderComponentWrapper,
    SubAppComponent,
    TopHeaderComponent,
  ],
})
export class TeamsModule {}
