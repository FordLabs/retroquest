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

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

import { AuthService } from '../auth.service';

import { AuthInterceptor } from './auth-interceptor.service';

describe('AuthInterceptor', () => {
  const fakeToken = 'fake-token';

  let interceptor;
  let mockHttpRequest;
  let mockRouter: Router;
  let mockHttpHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHttpRequest = { url: '', clone: jest.fn() };
    mockRouter = { navigateByUrl: jest.fn() } as unknown as Router;
    mockHttpHandler = { handle: jest.fn(() => of({})) };

    AuthService.getToken = jest.fn(() => fakeToken);

    interceptor = new AuthInterceptor(mockRouter);
  });

  describe('intercept', () => {
    it('should add the authorization to api requests', () => {
      interceptor.intercept(mockHttpRequest, mockHttpHandler);

      expect(AuthService.getToken).toHaveBeenCalled();
      expect(mockHttpRequest.clone).toHaveBeenCalledWith({
        setHeaders: {
          Authorization: `Bearer ${fakeToken}`,
        },
      });
    });

    it.each(AuthInterceptor.urlWhiteList)('should not add the authorization to %s requests', (url: string) => {
      mockHttpRequest.url = url;

      interceptor.intercept(mockHttpRequest, mockHttpHandler);

      expect(AuthService.getToken).toHaveBeenCalled();
      expect(mockHttpRequest.clone).not.toHaveBeenCalled();
    });
  });

  describe.each([401, 403])('handle auth error for %d', (status) => {
    beforeEach(() => {
      AuthService.clearToken = jest.fn();
      mockHttpHandler.handle = jest.fn(() =>
        throwError({ status, url: '/api/team/teamId/thought' } as HttpErrorResponse)
      );
    });

    it('should redirect to the login page', () => {
      interceptor.intercept(mockHttpRequest, mockHttpHandler).subscribe();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should clear the token', () => {
      interceptor.intercept(mockHttpRequest, mockHttpHandler).subscribe();
      expect(AuthService.clearToken).toHaveBeenCalled();
    });

    it('should return EMPTY if auth error', (done) => {
      interceptor
        .intercept(mockHttpRequest, mockHttpHandler)
        .pipe(isEmpty())
        .subscribe((response) => {
          expect(response).toEqual(true);
          done();
        });
    });
  });

  it('should only rethrow error if not auth issue', (done) => {
    mockHttpHandler.handle = jest.fn(() => throwError({ status: 500, url: '/something' } as HttpErrorResponse));
    interceptor.intercept(mockHttpRequest, mockHttpHandler).subscribe(
      () => done.fail('Should rethrow error'),
      (error) => {
        expect(error.status).toEqual(500);
        done();
      }
    );
  });

  it('should rethrow error if url is login url', (done) => {
    mockHttpHandler.handle = jest.fn(() =>
      throwError({ status: 401, url: 'http://localhost:4200/api/team/login' } as HttpErrorResponse)
    );
    interceptor.intercept(mockHttpRequest, mockHttpHandler).subscribe(
      () => done.fail('Should rethrow error'),
      (error) => {
        expect(error.status).toEqual(401);
        expect(error.url).toEqual('http://localhost:4200/api/team/login');
        done();
      }
    );
  });
});
