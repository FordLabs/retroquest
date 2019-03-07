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

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {AuthService} from '../auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthService.getToken() !== '' && AuthService.getToken() !== null && request.url !== '/api/team' &&
      request.url !== '/api/team/login' &&
      request.url !== 'https://api.github.com/repos/FordLabs/retroquest/contributors' &&
      request.url !== '/api/contributors' &&
      request.url !== 'api/captcha'
    ) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthService.getToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
