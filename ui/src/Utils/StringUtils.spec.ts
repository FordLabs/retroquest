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
import {
	checkValidityOfPassword,
	getPasswordInvalidMessage,
	getTeamNameInvalidMessage,
} from './StringUtils';

describe('String Utils', () => {
	const emptyTeamNameError = 'Please enter a team name.';
	const specialCharacterError =
		'Please enter a team name without any special characters.';

	it.each([
		['', emptyTeamNameError],
		[null, emptyTeamNameError],
		[undefined, emptyTeamNameError],
		['!', specialCharacterError],
		['@', specialCharacterError],
		['-', specialCharacterError],
		['_', specialCharacterError],
		['\\', specialCharacterError],
		['a', undefined],
		['1', undefined],
		['a1', undefined],
	])(
		'validating team name "%s" should return error message "%s"',
		(teamName, errorMessage) => {
			expect(getTeamNameInvalidMessage(teamName!)).toBe(errorMessage);
		}
	);

	const emptyPasswordError = 'Please enter a password.';
	const minLengthError = 'Password must be at least 8 characters.';
	const lowercaseError =
		'Password must contain at least one lower case letter.';
	const uppercaseError =
		'Password must contain at least one upper case letter.';
	const numberError = 'Password must contain at least one number.';

	it.each([
		['', emptyPasswordError],
		[null, emptyPasswordError],
		[undefined, emptyPasswordError],
		['1', minLengthError],
		['1234567', minLengthError],
		['A', minLengthError],
		['a', minLengthError],
		['aA1', minLengthError],
		['12345678', lowercaseError],
		['12345678A', lowercaseError],
		['12345678a', uppercaseError],
		['abcdefgA', numberError],
		['abcdefgA1', undefined],
		["abcdefgA1#!@#$%^&*()_+}{[];'\\<>? ", undefined],
	])(
		'validating password %s should return error message "%s"',
		(password, errorMessage) => {
			expect(getPasswordInvalidMessage(password!)).toBe(errorMessage);
		}
	);

	it.each([
		['', false],
		[null, false],
		[undefined, false],
		['1', false],
		['1234567', false],
		['A', false],
		['a', false],
		['aA1', false],
		['12345678', false],
		['12345678a', false],
		['abcdefgA', false],
		['abcdefgA1', true],
		['12345678A', true],
		['PASSWORD1', true],
		["abcdefgA1#!@#$%^&*()_+}{[];'\\<>? ", true],
		['P@ssw0rd', true],
	])('validating password %s should return "%s"', (password, errorMessage) => {
		expect(checkValidityOfPassword(password!)).toBe(errorMessage);
	});
});
