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

import EmailService from './EmailService';

describe('Email Service', () => {
	describe('sendTeamNameRecoveryEmail', () => {
		it('should send password reset link', async () => {
			await EmailService.sendTeamNameRecoveryEmail('recovery@email.com');

			expect(axios.post).toHaveBeenCalledWith('/api/email/recover-team-names', {
				recoveryEmail: 'recovery@email.com',
			});
		});
	});

	describe('sendPasswordResetEmail', () => {
		it('should send password reset link', async () => {
			await EmailService.sendPasswordResetEmail('Team Name', 'a@b.c');

			expect(axios.post).toHaveBeenCalledWith(
				'/api/email/password-reset-request',
				{
					teamName: 'Team Name',
					email: 'a@b.c',
				}
			);
		});
	});
});
