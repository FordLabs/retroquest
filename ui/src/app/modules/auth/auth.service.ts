/*
 *  Copyright (c) 2020 Ford Motor Company
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

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static tokenKey = 'token';
  static tokenDuration = 1000 * 60 * 60 * 24 * 2;

  static setToken (token): void {
    const expiresDate = new Date(Date.now() + AuthService.tokenDuration);
    const expires = expiresDate.toUTCString();
    document.cookie = `${AuthService.tokenKey}=${token};expires=${expires};`;
  }

  static getToken () {
    let token = null;
    const cookie = document.cookie;
    const keyIndex = cookie.indexOf(`${AuthService.tokenKey}=`);
    if (keyIndex >= 0) {
      const cookieMinusKey = cookie.substr(keyIndex + AuthService.tokenKey.length + 1);
      token = cookieMinusKey.split(';')[0];
    }
    return token;
  }

  static clearToken(): void {
    document.cookie = `${AuthService.tokenKey}=;expires=-99999999;`;
  }

}
