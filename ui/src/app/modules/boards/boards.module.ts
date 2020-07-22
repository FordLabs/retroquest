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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './pages/login/login.page';
import {CreateComponent} from './pages/create/create.page';
import {RouterModule} from '@angular/router';
import {AppTitleComponent} from './components/app-title/app-title.component';
import {BrandFooterComponent} from './components/brand-footer/brand-footer.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {ControlsModule} from '../controls/controls.module';
import {FocusOnLoadDirective} from './pages/directives/focus-on-load.component';
import {ContributorsComponent} from './components/contributors/contributors.component';
import {UpdatePasswordComponent} from './pages/update-password/update-password.page';
import {CreateUserComponent} from './pages/create-user/create-user.component';
import {UserViewComponent} from './pages/user-view/user-view.component';
import {LoginUserComponent} from './pages/login-user/login-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ControlsModule,
    RouterModule.forChild([
      {path: 'create', component: CreateComponent},
      {path: 'login', component: LoginComponent},
      {path: 'login/:teamId', component: LoginComponent},
      {path: 'update-password/:teamId', component: UpdatePasswordComponent},

      {path: 'create-user', component: CreateUserComponent},
      {path: 'login-user', component: LoginUserComponent},
      {path: 'user/:user', component: UserViewComponent}

    ]),
    RecaptchaModule.forRoot(),
    RecaptchaModule
  ],
  declarations: [
    LoginComponent,
    CreateComponent,
    UpdatePasswordComponent,
    AppTitleComponent,
    BrandFooterComponent,
    FocusOnLoadDirective,
    ContributorsComponent,
    CreateUserComponent,
    UserViewComponent,
    LoginUserComponent
  ],
  exports: [CreateComponent]
})
export class BoardsModule {
}
