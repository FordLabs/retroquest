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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {TeamsModule} from './modules/teams/teams.module';
import {BoardsModule} from './modules/boards/boards.module';
import {TokenInterceptor} from './modules/auth/token-interceptor/token.interceptor';
import {TeamService} from './modules/teams/services/team.service';
import {ControlsModule} from './modules/controls/controls.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {Column} from './modules/domain/column';
import {ColumnAggregationService} from './modules/teams/services/column-aggregation.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TeamsModule,
    ControlsModule,
    BoardsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'create', pathMatch: 'full'}
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    TeamService,
    ColumnAggregationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
