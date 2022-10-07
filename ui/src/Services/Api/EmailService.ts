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

import axios, { AxiosResponse } from 'axios';

import {
	EMAIL_PASSWORD_REQUEST_API_PATH,
	EMAIL_TEAM_NAME_RECOVERY_API_PATH,
} from './ApiConstants';

const EmailService = {
	sendTeamNameRecoveryEmail(recoveryEmail: string): Promise<AxiosResponse> {
		return axios.post(EMAIL_TEAM_NAME_RECOVERY_API_PATH, {
			recoveryEmail: recoveryEmail,
		});
	},

	sendPasswordResetEmail(
		teamName: string,
		email: string
	): Promise<AxiosResponse> {
		return axios.post(EMAIL_PASSWORD_REQUEST_API_PATH, {
			teamName: teamName,
			email: email,
		});
	},
};

export default EmailService;
