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

import React from 'react';

import './Banner.scss';

function Banner() {
	return (
		<div data-testid="banner" className="banner">
			<span>You can now change your team’s RetroQuest password!</span>
			<button className="go-to-settings-button">Set It Up Here</button>
			<button aria-label="Close Banner" className="close-banner-button">
				<i className="fas fa-close close-icon" aria-hidden />
			</button>
		</div>
	);
}

export default Banner;
