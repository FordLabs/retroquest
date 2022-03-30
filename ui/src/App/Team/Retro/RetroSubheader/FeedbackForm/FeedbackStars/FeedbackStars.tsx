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

import React, { Fragment, useState } from 'react';
import classNames from 'classnames';

import './FeedbackStars.scss';

type FeedbackStarsProps = {
	value: number;
	onChange: (stars: number) => void;
};

function FeedbackStars(props: FeedbackStarsProps) {
	const { value, onChange } = props;
	const [hoveredStarValue, setHoveredStarValue] = useState<number>(-1);

	return (
		<fieldset className={`feedback-stars`}>
			<div role="group" aria-labelledby="rate-retroquest">
				<p id="rate-retroquest" className="hidden">
					How would you rate your experience with retroquest?
				</p>
				<div className="star-list">
					{[1, 2, 3, 4, 5].map((starValue) => {
						const starId = `feedback-star-${starValue}`;
						const isHovering = starValue <= hoveredStarValue;
						const isHighlight = starValue <= value;
						return (
							<Fragment key={starId}>
								<input
									data-testid={`${starId}-input`}
									id={starId}
									type="radio"
									name="feedback-star"
									value={value}
									className={classNames('feedback-star-input with-font', {
										highlight: isHighlight || isHovering,
									})}
									onChange={() => onChange(starValue)}
								/>
								<label
									htmlFor={starId}
									data-testid={`${starId}-label`}
									onMouseEnter={() => setHoveredStarValue(starValue)}
									onMouseLeave={() => setHoveredStarValue(value)}
									aria-label={`Feedback rating of ${starValue}`}
								/>
							</Fragment>
						);
					})}
				</div>
			</div>
		</fieldset>
	);
}

export default FeedbackStars;
