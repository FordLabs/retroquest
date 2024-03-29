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

export const TOKEN_KEY = 'token';
const cookies = new Cookies();

const CookieService = {
	setToken: (accessToken: string): void => {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 2);

		cookies.set(TOKEN_KEY, accessToken, {
			path: '/',
			secure: true,
			sameSite: 'lax',
			expires: expirationDate,
		});
	},

	getToken: (): string => cookies.get(TOKEN_KEY),

	clearToken: (): void => {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() - 2);
		cookies.remove(TOKEN_KEY, {
			path: '/',
			expires: expirationDate,
		});
	},
};

export default CookieService;
