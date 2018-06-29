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

import {AuthService} from './auth.service';

describe('AuthService', () => {

  afterEach(() => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  });

  describe('setToken', () => {

    it('should set the token in the token cookie', () => {
      const token = 'im.a.jwt';

      AuthService.setToken(token);

      expect(document.cookie).toEqual(`token=${token}`);
    });
  });

  describe('getToken', () => {

    it('should get the token after its been set', () => {
      const expectedToken = 'im.a.jwt';
      AuthService.setToken(expectedToken);

      const actualToken = AuthService.getToken();

      expect(actualToken).toEqual(expectedToken);
    });

    it('should return null when the token is not set', () => {
      const expectedToken = null;

      const actualToken = AuthService.getToken();

      expect(actualToken).toEqual(expectedToken);
    });
  });
});
