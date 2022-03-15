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
export const TEAM_NAME_REGEX = /^[A-Za-z0-9 ]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const LOWERCASE_REGEX = /[a-z]/;
export const UPPERCASE_REGEX = /[A-Z]/;
export const NUMBER_REGEX = /\d/;

export function validateTeamName(team: string): string | undefined {
	if (!team) {
		return 'Please enter a team name.';
	} else if (!team.match(TEAM_NAME_REGEX)) {
		return 'Please enter a team name without any special characters.';
	}
}

export function validatePassword(password: string): string | undefined {
	if (!password) {
		return 'Please enter a password.';
	} else if (password.length < 8) {
		return 'Password must be at least 8 characters.';
	} else if (!password.match(LOWERCASE_REGEX)) {
		return 'Password must contain at least one lower case letter.';
	} else if (!password.match(UPPERCASE_REGEX)) {
		return 'Password must contain at least one upper case letter.';
	} else if (!password.match(NUMBER_REGEX)) {
		return 'Password must contain at least one number.';
	}
}

export function validateConfirmationPassword(
	password: string,
	confirmationPassword: string
) {
	if (password !== confirmationPassword) {
		return 'Please enter matching passwords';
	}
}
