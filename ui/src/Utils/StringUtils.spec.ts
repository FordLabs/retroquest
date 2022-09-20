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
import { checkValidityOfPassword } from './StringUtils';

describe('String Utils', () => {
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
