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

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';

import { environment } from '../environments/environment';

import { AuthInterceptor } from './modules/auth/auth-interceptor/auth-interceptor.service';
import { BoardsModule } from './modules/boards/boards.module';
import { ComponentsModule } from './modules/components/components.module';
import { DataService } from './modules/data.service';
import { ColumnAggregationService } from './modules/teams/services/column-aggregation.service';
import { TeamService } from './modules/teams/services/team.service';
import { TeamsModule } from './modules/teams/teams.module';
import { AppComponent } from './app.component';
import { myRxStompConfig } from './my-rx-stomp.config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    TeamsModule,
    ComponentsModule,
    BoardsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([{ path: '', redirectTo: 'login', pathMatch: 'full' }], { relativeLinkResolution: 'legacy' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    TeamService,
    DataService,
    ColumnAggregationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
