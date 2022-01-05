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

import { ComponentsModule } from '../components/components.module';

import { AppTitleComponent } from './components/app-title/app-title.component';
import { BrandFooterComponent } from './components/brand-footer/brand-footer.component';
import { CreateComponent } from './pages/create/create.page';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { FocusOnLoadDirective } from './pages/directives/focus-on-load.component';
import { LoginComponent } from './pages/login/login.page';
import { LoginUserComponent } from './pages/login-user/login-user.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.page';
import { UserViewComponent } from './pages/user-view/user-view.component';
// @ts-ignore
import { MyComponentWrapperComponent } from './pages/my-react-page/MyReactComponentWrapper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild([
      { path: 'create', component: CreateComponent },
      { path: 'login', component: MyComponentWrapperComponent },
      { path: 'login/:teamId', component: LoginComponent },
      { path: 'update-password/:teamId', component: UpdatePasswordComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'login-user', component: LoginUserComponent },
      { path: 'user/:user', component: UserViewComponent },
    ]),
    RecaptchaModule,
  ],
  declarations: [
    LoginComponent,
    CreateComponent,
    UpdatePasswordComponent,
    AppTitleComponent,
    BrandFooterComponent,
    FocusOnLoadDirective,
    CreateUserComponent,
    UserViewComponent,
    LoginUserComponent,
  ],
  exports: [CreateComponent],
})
export class BoardsModule {}
