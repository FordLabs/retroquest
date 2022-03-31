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

import { mockGetCookie } from '../../__mocks__/universal-cookie';
import Feedback from '../../Types/Feedback';

import FeedbackService from './FeedbackService';

describe('Feedback Service', () => {
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };

	beforeAll(() => {
		mockGetCookie.mockReturnValue(fakeToken);
	});

	describe('submitFeedback', () => {
		it('should submit user feedback', () => {
			const feedback: Feedback = {
				stars: 5,
				comment: 'My experience was great!',
				userEmail: 'a@b.c',
				teamId: 'team-id',
			};

			FeedbackService.submitFeedback(feedback);
			expect(axios.post).toHaveBeenCalledWith(
				'/api/feedback/',
				feedback,
				mockConfig
			);
		});
	});
});
