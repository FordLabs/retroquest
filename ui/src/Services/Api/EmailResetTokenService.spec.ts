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
import axios from 'axios';

import { mockTeam } from './__mocks__/TeamService';
import EmailResetTokenService from './EmailResetTokenService';

describe('Email Reset Token Service', () => {
	describe('checkIfResetTokenIsValid', () => {
		it('should return true when token is valid', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: true });
			const isValidToken =
				await EmailResetTokenService.checkIfResetTokenIsValid('valid-token');
			expect(axios.get).toHaveBeenCalledWith(
				'/api/email-reset-token/valid-token/is-valid'
			);
			expect(isValidToken).toBeTruthy();
		});

		it('should return true when token is invalid', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: false });
			const isValidToken =
				await EmailResetTokenService.checkIfResetTokenIsValid('invalid-token');
			expect(axios.get).toHaveBeenCalledWith(
				'/api/email-reset-token/invalid-token/is-valid'
			);
			expect(isValidToken).toBeFalsy();
		});
	});

	describe('getResetTokenLifetime', () => {
		it('should get the lifetime of the reset token', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: 500 });
			const actualTokenLifetime =
				await EmailResetTokenService.getResetTokenLifetime();
			expect(axios.get).toHaveBeenCalledWith(
				'/api/email-reset-token/lifetime-in-seconds'
			);
			expect(actualTokenLifetime).toBe(500);
		});
	});

	describe('getTeamByResetToken', () => {
		it('should get team by email reset token', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: mockTeam });
			const emailResetToken = 'fake-email-reset-token';
			const actualTeam = await EmailResetTokenService.getTeamByResetToken(
				emailResetToken
			);
			expect(axios.get).toHaveBeenCalledWith(
				`/api/email-reset-token/${emailResetToken}/team`
			);
			expect(actualTeam).toBe(mockTeam);
		});
	});
});
