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

import {TokenInterceptor} from './token.interceptor';
import {AuthService} from '../auth.service';

describe('TokenInterceptor', () => {
  const fakeToken = 'fake-token';

  let interceptor;
  let mockHttpRequest;

  let mockHttpHandler;
  beforeEach(() => {
    mockHttpRequest = jasmine.createSpyObj({
      clone: null
    });

    mockHttpRequest.url = '';

    mockHttpHandler = jasmine.createSpyObj({
      handle: null
    });

    spyOn(AuthService, 'getToken').and.returnValue(fakeToken);

    interceptor = new TokenInterceptor();
  });
  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add the authorization to api requests', () => {
      interceptor.intercept(mockHttpRequest, mockHttpHandler);

      expect(AuthService.getToken).toHaveBeenCalled();
      expect(mockHttpRequest.clone).toHaveBeenCalledWith({
        setHeaders: {
          Authorization: `Bearer ${fakeToken}`
        }
      });
    });

    it('should not add the authorization to login requests', () => {
      mockHttpRequest.url = '/api/team/login';

      interceptor.intercept(mockHttpRequest, mockHttpHandler);

      expect(AuthService.getToken).toHaveBeenCalled();
      expect(mockHttpRequest.clone).not.toHaveBeenCalled();
    });
  });
});
