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

import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  static urlWhiteList: string[] = [
    '/api/team',
    '/api/team/login',
    'https://api.github.com/repos/FordLabs/retroquest/contributors',
    '/api/contributors',
    'api/captcha'
  ]

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401 || error.status === 403) {
      AuthService.clearToken();
      this.router.navigateByUrl('/login');
      return EMPTY;
    } else {
      return throwError(error);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthService.getToken() && !TokenInterceptor.urlWhiteList.includes(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthService.getToken()}`
        }
      });
    }

    return next.handle(request).pipe(catchError((error) => this.handleAuthError(error)));
  }
}
