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

const PASSWORD_RESET_TOKEN_API_PATH = '/api/password-reset-token';

const PasswordResetTokenService = {
	checkIfResetTokenIsValid(resetToken: string): Promise<boolean> {
		const url = `${PASSWORD_RESET_TOKEN_API_PATH}/${resetToken}/is-valid`;
		return axios.get(url).then((res) => res.data);
	},

	getResetTokenLifetime(): Promise<number> {
		return axios
			.get(`${PASSWORD_RESET_TOKEN_API_PATH}/lifetime-in-seconds`)
			.then((response) => response.data);
	},
};

export default PasswordResetTokenService;
