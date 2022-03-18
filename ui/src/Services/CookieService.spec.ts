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

import Cookies from 'universal-cookie';

import CookieService from './CookieService';

describe('Cookie Service', () => {
	const cookies = new Cookies();
	const tokenKey = 'token';

	beforeEach(() => {
		jest.useFakeTimers();
	});

	it('should set token cookie', () => {
		const token = 'fake-jwt-token';
		CookieService.setToken(token);

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 2);
		expect(cookies.set).toHaveBeenCalledWith(tokenKey, token, {
			path: '/',
			secure: true,
			sameSite: 'lax',
			expires: expirationDate,
		});
	});

	it('should get token cookie', () => {
		const actualToken = CookieService.getToken();
		expect(actualToken).toBe('mock-jwt-token');
		expect(cookies.get).toHaveBeenCalledWith(tokenKey);
	});

	it('should clear token cookie', () => {
		CookieService.clearToken();

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() - 2);
		expect(cookies.remove).toHaveBeenCalledWith(tokenKey, {
			path: '/',
			expires: expirationDate,
		});
	});
});
